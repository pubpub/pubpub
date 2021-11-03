/* global it, expect, beforeAll, afterAll */
import { setup, teardown, login, modelize } from 'stubstub';
import { createSubmission } from '../queries';
import { Submission } from '../../models';

const models = modelize`
	Community community {
		Member {
			permissions: "admin"
			User admin {}
		}
		Collection collection {
			Member {
				permissions: "edit"
				User collectionEditor {}
			}
			Member {
				permissions: "manager"
				User collectionManager {}
			}
			CollectionPub {
				Pub spubbable {}
				Pub spub {
					Member {
						permissions: "admin"
						User pubAdmin {}
					}
					Submission submission {
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
	const { admin, spub } = models;
	const agent = await login(admin);
	const {
		body: { pubId, status },
	} = await agent
		.post('/api/submissions')
		.send({
			pubId: spub.id,
			status: 'submitted',
		})
		.expect(201);
	expect(pubId).toEqual(spub.id);
	expect(status).toEqual('submitted');
});

it('changes a submission status', async () => {
	const { admin, spub, submission } = models;
	const agent = await login(admin);
	const {
		body: { status, id, pubId },
	} = await agent
		.put('/api/submissions')
		.send({
			id: submission.id,
			status: 'incomplete',
		})
		.expect(201);
	expect(pubId).toEqual(spub.id);
	expect(id).toEqual(submission.id);
	expect(status).toEqual('incomplete');
});

it('does not allow admins of another community to modify a submission', async () => {
	const { submission, anotherAdmin } = models;
	const agent = await login(anotherAdmin);
	await agent
		.put('/api/submissions')
		.send({
			id: submission.id,
			status: 'completed',
		})
		.expect(403);
});

it('does not allow normal users to modify a submission', async () => {
	const { submission, guest } = models;
	const agent = await login(guest);
	await agent
		.put('/api/submissions')
		.send({
			id: submission.id,
			status: 'completed',
		})
		.expect(403);
});

it('does not allow pub admins to update pub status', async () => {
	const { pubAdmin, submission } = models;
	const agent = await login(pubAdmin);
	await agent
		.put('/api/submissions')
		.send({
			id: submission.id,
			status: 'completed',
		})
		.expect(403);
});

it('does allow collection managers to update pub status', async () => {
	const { collectionManager, submission } = models;
	const agent = await login(collectionManager);
	await agent
		.put('/api/submissions')
		.send({
			id: submission.id,
			status: 'completed',
		})
		.expect(403);
});

it('does not allow changing status to something besides incomplete, submitted, accepted, declined', async () => {
	const { admin, spubbable } = models;
	const submission = await createSubmission({
		pubId: spubbable.id,
		status: 'submitted',
	});
	const agent = await login(admin);
	await agent
		.put('/api/submissions')
		.send({
			id: submission.id,
			status: 'disallowed status',
		})
		.expect(400);
});

it('deletes an existing submission with appropriate permissions', async () => {
	const { admin, community, spub } = models;
	const submission = await createSubmission({
		pubId: spub.id,
		status: 'incomplete',
	});
	const agent = await login(admin);
	await agent
		.delete('/api/submissions')
		.send({ id: submission.id, communityId: community.id })
		.expect(200);
	const submissionNow = await Submission.findOne({ where: { id: submission.id } });
	expect(submissionNow).toEqual(null);
});

it('does not allow normal users to delete a submission', async () => {
	const { guest, spub } = models;
	const submission = await createSubmission({
		pubId: spub.id,
		title: 'incomplete',
	});
	const agent = await login(guest);
	await agent
		.delete('/api/submissions')
		.send({ id: submission.id })
		.expect(403);
	const submissionNow = await Submission.findOne({ where: { id: submission.id } });
	expect(submissionNow.id).toEqual(submission.id);
});

teardown(afterAll);
