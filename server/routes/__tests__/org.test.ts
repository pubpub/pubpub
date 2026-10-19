import uuid from 'uuid';

import { CommunityTemplate, Org, OrgMember } from 'server/models';
import { login, modelize, setup, teardown } from 'stubstub';

let org: Org;

const models = modelize`
	User superAdmin {
		isSuperAdmin: true
	}
	User orgManager {}
	User regularUser {}
`;

setup(beforeAll, async () => {
	await models.resolve();
	org = await Org.create({
		slug: `route-org-${uuid.v4().slice(0, 8)}`,
		title: 'Route Org',
		isActive: true,
		communityCreationEnabled: true,
	});
	await OrgMember.create({ orgId: org.id, userId: models.orgManager.id });
	await CommunityTemplate.create({
		slug: `route-tpl-${uuid.v4().slice(0, 8)}`,
		title: 'Route Org Template',
		isActive: true,
		orgId: org.id,
	});
});
teardown(afterAll);

const host = 'www.pubpub.org';

describe('org pages', () => {
	it('serves the landing page and dashboard to superadmins and org managers', async () => {
		for (const user of [models.superAdmin, models.orgManager]) {
			const agent = await login(user);
			await agent.get(`/org/${org.slug}`).set('Host', host).expect(200);
			await agent.get(`/org/${org.slug}/data`).set('Host', host).expect(200);
		}
	});

	it('hides org pages from other users during the private rollout', async () => {
		const agent = await login(models.regularUser);
		await agent.get(`/org/${org.slug}`).set('Host', host).expect(404);
		await agent.get(`/org/${org.slug}/data`).set('Host', host).expect(404);
		await (await login()).get(`/org/${org.slug}`).set('Host', host).expect(404);
	});

	it('serves the directory and the superadmin Orgs tab to superadmins', async () => {
		const agent = await login(models.superAdmin);
		await agent.get('/orgs').set('Host', host).expect(200);
		await agent.get('/superadmin/orgs').set('Host', host).expect(200);
	});

	it('offers the org templates on community create', async () => {
		const agent = await login(models.orgManager);
		const { text } = await agent
			.get(`/community/create?org=${org.slug}`)
			.set('Host', host)
			.expect(200);
		expect(text).toContain('Route Org Template');
	});

	it('lists org managers through the org API', async () => {
		const agent = await login(models.orgManager);
		const { body } = await agent
			.get(`/api/orgs/${org.id}/managers`)
			.set('Host', host)
			.expect(200);
		expect(body.map((m) => m.userId)).toContain(models.orgManager.id);
	});
});
