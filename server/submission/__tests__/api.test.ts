/* global describe, it, expect, beforeAll, afterAll */
import { setup, teardown, login, modelize, expectCreatedActivityItem } from 'stubstub';
import * as types from 'types';
import { Member, Submission } from 'server/models';

const models = modelize`
	Community community {
		Member {
			permissions: "admin"
			User admin {}
		}
		Collection collection {
			SubmissionWorkflow disabledWorkflow {
				title: "Some disabled workflow"
			}
			SubmissionWorkflow submissionWorkflow {
				title: "Some enabled workflow"
				enabled: true
				Submission submission1 {
					status: "incomplete"
					Pub spub1 {
						Member {
							permissions: "manage"
							User pubManager {}
						}
					}
				}
				Submission submission2 {
					status: "submitted"
					Pub {}
				}
			}
			Member {
				permissions: "edit"
				User collectionEditor {}
			}
			Member {
				permissions: "view"
				User collectionViewer {}
			}
			Member {
				permissions: "manage"
				User collectionManager {}
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

describe('/api/submissions', () => {
	it('forbids pub managers to update pub status beyond submitted', async () => {
		const { pubManager, submission1 } = models;
		const agent = await login(pubManager);
		await agent
			.put('/api/submissions')
			.send({
				id: submission1.id,
				status: 'accepted',
			})
			.expect(403);
	});

	it('forbids admins of another community to update status', async () => {
		const { submission1, community, collection, anotherAdmin } = models;
		const agent = await login(anotherAdmin);
		await agent
			.put('/api/submissions')
			.send({
				communityId: community.id,
				collectionId: collection.id,
				id: submission1.id,
				status: 'submitted',
			})
			.expect(403);
	});

	it('forbids collection editors to update pub status', async () => {
		const { submission1, collectionEditor, community } = models;
		const agent = await login(collectionEditor);
		await agent
			.put('/api/submissions')
			.send({
				communityId: community.id,
				id: submission1.id,
				status: 'submitted',
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

	it('forbids a visitor to submit to a disabled workflow', async () => {
		const { guest, disabledWorkflow } = models;
		const agent = await login(guest);
		await agent
			.post('/api/submissions')
			.send({ submissionWorkflowId: disabledWorkflow.id })
			.expect(403);
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

	it('allows pub managers to set submission status', async () => {
		const { pubManager, submission, spub } = models;
		const agent = await login(pubManager);
		await agent
			.put('/api/submissions')
			.send({
				id: submission.id,
				pubId: spub.id,
				status: 'pending',
			})
			.expect(201);
		const { status, submittedAt } = await Submission.findOne({ where: { id: submission.id } });
		expect(status).toEqual('pending');
		expect(Number.isNaN(new Date(submittedAt).getTime())).toEqual(false);
	});

	it('forbids admins from updating status out of one of [pending, accepted, declined]', async () => {
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
	it('allows pub editors to set submitted status', async () => {
		const { pubManager, submission1 } = models;
		const agent = await login(pubManager);
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
			actorId: pubManager.id,
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

	it('allows a visitor to create a new submission', async () => {
		const { guest, submissionWorkflow } = models;
		const agent = await login(guest);
		const {
			body: { pubId, status },
		} = await expectCreatedActivityItem(
			agent
				.post('/api/submissions')
				.send({ submissionWorkflowId: submissionWorkflow.id })
				.expect(201),
		).toMatchResultingObject((response) => ({
			kind: 'submission-created',
			pubId: response.body.pubId,
			actorId: guest.id,
		}));
		expect(await Member.count({ where: { pubId, userId: guest.id } })).toEqual(1);
		expect(status).toEqual('incomplete');
	});
});

teardown(afterAll);
