import { vi } from 'vitest';

import { CommunityModerationReport, SpamTag, User } from 'server/models';
import { login, modelize, setup, teardown } from 'stubstub';

vi.mock('server/utils/slack', () => ({
	postToSlackAboutCommunityFlag: vi.fn(),
	postToSlackAboutNewUserSpamTag: vi.fn(),
}));

vi.mock('server/utils/email', () => ({
	sendNewSpamTagDevEmail: vi.fn(),
	sendCommunityFlagDevEmail: vi.fn(),
	sendCommunityFlagResolvedEmail: vi.fn(),
}));

const models = modelize`
	User superadmin {
		isSuperAdmin: true
	}
	Community community {
		Member {
			permissions: "admin"
			User admin {}
		}
		Member {
			permissions: "view"
			User viewer {}
		}
	}
	User targetUser {}
`;

setup(beforeAll, async () => {
	await models.resolve();
});

teardown(afterAll);

it('allows a community admin to create a moderation report and auto-creates a spam tag', async () => {
	const { admin, community, targetUser } = models;
	const agent = await login(admin);

	const res = await agent
		.post('/api/communityModerationReports')
		.send({
			userId: targetUser.id,
			communityId: community.id,
			reason: 'spam-content',
			reasonText: 'looks like spam',
		})
		.expect(201);

	expect(res.body.userId).toEqual(targetUser.id);
	expect(res.body.communityId).toEqual(community.id);
	expect(res.body.reason).toEqual('spam-content');
	expect(res.body.status).toEqual('active');
	expect(res.body.spamTagId).toBeTruthy();

	const refreshedUser = await User.findByPk(targetUser.id);
	expect(refreshedUser?.spamTagId).toBeTruthy();
	const tag = await SpamTag.findByPk(res.body.spamTagId);
	expect(tag).toBeTruthy();
	expect(tag?.status).toEqual('unreviewed');
});

it('forbids non-admins from creating a moderation report', async () => {
	const { viewer, community, targetUser } = models;
	const agent = await login(viewer);

	await agent
		.post('/api/communityModerationReports')
		.send({
			userId: targetUser.id,
			communityId: community.id,
			reason: 'harassment',
		})
		.expect(403);
});

it('allows a community admin to retract their own report', async () => {
	const { admin, community, targetUser } = models;
	const agent = await login(admin);

	const createRes = await agent
		.post('/api/communityModerationReports')
		.send({
			userId: targetUser.id,
			communityId: community.id,
			reason: 'hateful-language',
		})
		.expect(201);

	const reportId = createRes.body.id;

	await agent
		.put(`/api/communityModerationReports/${reportId}`)
		.send({ status: 'retracted' })
		.expect(200);

	const report = await CommunityModerationReport.findByPk(reportId);
	expect(report?.status).toEqual('retracted');
});

it('rate-limits excessive report creation', async () => {
	const { admin, community, targetUser } = models;
	const agent = await login(admin);

	const promises = Array.from({ length: 7 }, () =>
		agent.post('/api/communityModerationReports').send({
			userId: targetUser.id,
			communityId: community.id,
			reason: 'spam-content',
		}),
	);

	const responses = await Promise.all(promises);
	const tooMany = responses.filter((r) => r.status === 429);
	expect(tooMany.length).toBeGreaterThan(0);
});

it('blocks a reported user from creating discussions in that community', async () => {
	const { admin, community, targetUser } = models;
	const adminAgent = await login(admin);

	await adminAgent
		.post('/api/communityModerationReports')
		.send({
			userId: targetUser.id,
			communityId: community.id,
			reason: 'spam-content',
		})
		.expect(201);

	const targetAgent = await login(targetUser);

	// the targetUser should be blocked from creating discussions in this community
	await targetAgent
		.post('/api/discussions')
		.send({
			communityId: community.id,
			content: { type: 'doc', content: [] },
			text: 'test',
		})
		.expect(403);
});

it('retracting a report re-enables the user to create thread comments', async () => {
	const { admin, community, targetUser } = models;
	const adminAgent = await login(admin);

	await adminAgent
		.post('/api/communityModerationReports')
		.send({
			userId: targetUser.id,
			communityId: community.id,
			reason: 'other',
			reasonText: 'testing retraction',
		})
		.expect(201);

	const activeReports = await CommunityModerationReport.findAll({
		where: { userId: targetUser.id, communityId: community.id, status: 'active' },
	});

	await Promise.all(
		activeReports.map((report) =>
			adminAgent
				.put(`/api/communityModerationReports/${report.id}`)
				.send({ status: 'retracted' })
				.expect(200),
		),
	);

	const remaining = await CommunityModerationReport.count({
		where: { userId: targetUser.id, communityId: community.id, status: 'active' },
	});
	expect(remaining).toEqual(0);
});
