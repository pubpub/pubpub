/* global it, expect, beforeAll, afterAll */
import { setup, teardown, login, modelize } from 'stubstub';
// import { createSubmission } from '../queries';
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

it('allows pub editors to set submitted status', async () => {
	const { pubAdmin, submission, spub } = models;
	const agent = await login(pubAdmin);
	await agent
		.put('/api/submissions')
		.send({
			submissionId: submission.id,
			pubId: spub.id,
			status: 'submitted',
		})
		.expect(201);
	const { status } = await Submission.findOne({ where: { id: submission.id } });
	expect(status).toEqual('submitted');
});

it('creates a new submission', async () => {
	const { admin, spub, community } = models;
	const agent = await login(admin);
	const {
		body: { pubId, status },
	} = await agent
		.post('/api/submissions')
		.send({
			communityId: community.id,
			pubId: spub.id,
			status: 'submitted',
		})
		.expect(201);
	expect(pubId).toEqual(spub.id);
	expect(status).toEqual('submitted');
});

it('allows collection managers to update pub status', async () => {
	const { collection, collectionManager, submission } = models;
	const agent = await login(collectionManager);
	await agent
		.put('/api/submissions')
		.send({
			collectionId: collection.id,
			submissionId: submission.id,
			status: 'accepted',
		})
		.expect(201);
});

it('forbids admins of another community to modify a submission', async () => {
	const { submission, community, collection, anotherAdmin } = models;
	const agent = await login(anotherAdmin);
	await agent
		.put('/api/submissions')
		.send({
			communityId: community.id,
			collectionId: collection.id,
			submissionId: submission.id,
			status: 'completed',
		})
		.expect(403);
});
/*

it('does not allow collection editors to modify a submission', async () => {
	const { submission, collectionMember, community } = models;
	const agent = await login(collectionMember);
	await agent
		.put('/api/submissions')
		.send({
			communityId: community.id,
			submissionId: submission.id,
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
			submissionId: submission.id,
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
			submissionId: submission.id,
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
		.send({ submissionId: submission.id, communityId: community.id })
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
	await agent.delete('/api/submissions').send({ submissionId: submission.id }).expect(403);
	const submissionNow = await Submission.findOne({ where: { id: submission.id } });
	expect(submissionNow.id).toEqual(submission.id);
});
*/

teardown(afterAll);
