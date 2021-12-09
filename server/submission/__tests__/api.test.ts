/* global it, expect, beforeAll, afterAll */
import { setup, teardown, login, modelize, expectCreatedActivityItem } from 'stubstub';
import * as types from 'types';

import { Submission } from '../../models';

const models = modelize`
	Community community {
		Member {
			permissions: "admin"
			User admin {}
		}
		Collection collection {
			Member {
				permissions: "view"
				User collectionMember {}
			}
			Member {
				permissions: "manage"
				User collectionManager {}
			}
			CollectionPub {
				Pub spubbable {}
				Pub spub {
					Member {
						permissions: "admin"
						User pubAdmin {}
					}
					Submission submission1 {
						status: "incomplete"
					}
					Submission submission2 {
						status: "incomplete"
					}
				}
			}
		}
	}
	Community {
		Member {
			permissions: "admin"
			User anotherAdmin {}
		}
	}
	User guest {}
`;

setup(beforeAll, async () => {
	await models.resolve();
});

it('creates a new submission', async () => {
	const { admin, spub, community } = models;
	const agent = await login(admin);
	const {
		body: { pubId, status },
	} = await expectCreatedActivityItem(
		agent
			.post('/api/submissions')
			.send({
				communityId: community.id,
				pubId: spub.id,
			})
			.expect(201),
	).toMatchObject({
		kind: 'submission-created',
		pubId: spub.id,
		actorId: admin.id,
	});

	expect(pubId).toEqual(spub.id);
	expect(status).toEqual('incomplete');
});

it('forbids pub admins to update pub status beyond completed', async () => {
	const { pubAdmin, submission1 } = models;
	const agent = await login(pubAdmin);
	await agent
		.put('/api/submissions')
		.send({
			id: submission1.id,
			status: 'accepted',
		})
		.expect(403);
});

it('forbids admins of another community to update pub status', async () => {
	const { submission1, community, collection, anotherAdmin } = models;
	const agent = await login(anotherAdmin);
	await agent
		.put('/api/submissions')
		.send({
			communityId: community.id,
			collectionId: collection.id,
			id: submission1.id,
			status: 'completed',
		})
		.expect(403);
});

it('forbids collection editors to update pub status', async () => {
	const { submission1, collectionMember, community } = models;
	const agent = await login(collectionMember);
	await agent
		.put('/api/submissions')
		.send({
			communityId: community.id,
			id: submission1.id,
			status: 'completed',
		})
		.expect(403);
});

it('forbids admins to update from incomplete status', async () => {
	const { admin, submission1 } = models;
	const agent = await login(admin);
	await agent
		.put('/api/submissions')
		.send({
			id: submission1.id,
			status: 'accepted',
		})
		.expect(403);
});

it('allows pub editors to set submitted status', async () => {
	const { pubAdmin, submission1 } = models;
	const agent = await login(pubAdmin);
	const prevSubmission: types.Submission = await Submission.findOne({
		where: { id: submission1.id },
	});
	await expectCreatedActivityItem(
		agent
			.put('/api/submissions')
			.send({
				id: submission1.id,
				pubId: submission1.pubId,
				status: 'submitted',
			})
			.expect(201),
	).toMatchResultingObject((response) => ({
		kind: 'submission-status-changed',
		pubId: submission1.pubId,
		actorId: pubAdmin.id,
		payload: {
			submissionId: submission1.id,
			status: {
				from: prevSubmission.status,
				to: response.body.status,
			},
		},
	}));
	const { status } = await Submission.findOne({ where: { id: submission1.id } });
	expect(status).toEqual('submitted');
});

it('forbids admins to update status out of one of [submitted, accepted, declined]', async () => {
	const { admin, submission1 } = models;
	const agent = await login(admin);
	await agent
		.put('/api/submissions')
		.send({
			id: submission1.id,
			status: 'incomplete',
		})
		.expect(403);
});

it('allows collection managers to update pub status to submitted', async () => {
	const { collection, collectionManager, submission2 } = models;
	const agent = await login(collectionManager);
	const prevSubmission: types.Submission = await Submission.findOne({
		where: { id: submission2.id },
	});
	await expectCreatedActivityItem(
		agent
			.put('/api/submissions')
			.send({
				pubId: submission2.pubId,
				collectionId: collection.id,
				id: submission2.id,
				status: 'submitted',
			})
			.expect(201),
	).toMatchResultingObject((response) => ({
		kind: 'submission-status-changed',
		pubId: submission2.pubId,
		actorId: collectionManager.id,
		payload: {
			submissionId: submission2.id,
			status: {
				from: prevSubmission.status,
				to: response.body.status,
			},
		},
	}));
	const { status } = await Submission.findOne({ where: { id: submission2.id } });
	expect(status).toEqual('submitted');
});

it('allows collection managers to update pub status to accepted', async () => {
	const { collection, collectionManager, submission2 } = models;
	const agent = await login(collectionManager);
	const prevSubmission: types.Submission = await Submission.findOne({
		where: { id: submission2.id },
	});
	await expectCreatedActivityItem(
		agent
			.put('/api/submissions')
			.send({
				pubId: submission2.pubId,
				collectionId: collection.id,
				id: submission2.id,
				status: 'accepted',
			})
			.expect(201),
	).toMatchResultingObject((response) => ({
		kind: 'submission-status-changed',
		pubId: submission2.pubId,
		actorId: collectionManager.id,
		payload: {
			submissionId: submission2.id,
			status: {
				from: prevSubmission.status,
				to: response.body.status,
			},
		},
	}));
	const { status } = await Submission.findOne({ where: { id: submission2.id } });
	expect(status).toEqual('accepted');
});

it('allows collection managers to update pub status to declined', async () => {
	const { collection, collectionManager, submission2 } = models;
	const agent = await login(collectionManager);
	const prevSubmission: types.Submission = await Submission.findOne({
		where: { id: submission2.id },
	});
	await expectCreatedActivityItem(
		agent
			.put('/api/submissions')
			.send({
				pubId: submission2.pubId,
				collectionId: collection.id,
				id: submission2.id,
				status: 'declined',
			})
			.expect(201),
	).toMatchResultingObject((response) => ({
		kind: 'submission-status-changed',
		pubId: submission2.pubId,
		actorId: collectionManager.id,
		payload: {
			submissionId: submission2.id,
			status: {
				from: prevSubmission.status,
				to: response.body.status,
			},
		},
	}));
	const { status } = await Submission.findOne({ where: { id: submission2.id } });
	expect(status).toEqual('declined');
});

it('forbids normal user to delete a submission', async () => {
	const { guest, submission1, community } = models;
	const agent = await login(guest);
	await agent
		.delete('/api/submissions')
		.send({ id: submission1.id, communityId: community.id })
		.expect(403);
	const submissionNow = await Submission.findOne({ where: { id: submission1.id } });
	expect(submissionNow.id).toEqual(submission1.id);
});

it('allows admin to delete a submission', async () => {
	const { admin, community, submission1 } = models;
	const agent = await login(admin);
	await expectCreatedActivityItem(
		agent
			.delete('/api/submissions')
			.send({ id: submission1.id, communityId: community.id })
			.expect(200),
	).toMatchObject({
		kind: 'submission-deleted',
		pubId: submission1.pubId,
		actorId: admin.id,
		payload: {
			submissionId: submission1.id,
		},
	});
	const submissionNow = await Submission.findOne({ where: { id: submission1.id } });
	expect(submissionNow).toEqual(null);
});

teardown(afterAll);
