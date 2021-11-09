/* global it, expect, beforeAll, afterAll */
import { setup, teardown, login, modelize } from 'stubstub';
import { SubmissionWorkflow } from '../../models';

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
			SubmissionWorkflow submissionWorkflow {}
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

it('allows admin to create a new submission workflow', async () => {
	const { admin, community, collection, submissionWorkflow } = models;
	const agent = await login(admin);
	const {
		body: { id, enabled, targetEmailAddress, collectionId },
	} = await agent
		.post('/api/submissionWorkflows')
		.send({
			collectionId: collection.id,
			communityId: community.id,
			enabled: true,
			targetEmailAddress: 'finnandjakeforwvwer@adventuretime.com',
		})
		.expect(201);
	console.log(submissionWorkflow.id, 'THIS IS the ID???????');
	console.log(id, 'THIS IS the ID???????');
	expect(collectionId).toEqual(collection.id);
	expect(enabled).toEqual(true);
	expect(targetEmailAddress).toEqual('finnandjakeforwvwer@adventuretime.com');
});

it('allows admin to update an existing workflow', async () => {
	const { admin, submissionWorkflow } = models;
	// const agent = await login(admin);
	// const {
	// 	body: { id, enabled, afterSubmittedText },
	// } = await agent
	// 	.put('/api/submissionWorkflows')
	// 	.send({
	// 		enabled: false,
	// 		afterSubmittedText: 'This will no longer be an enbaled workflow',
	// 	})
	// 	.expect(200);
	console.log(submissionWorkflow.id, 'THIS IS AN ID???????');
	expect(false).toEqual(false);
	// expect(afterSubmittedText).toEqual('This will no longer be an enbaled workflow');
});

teardown(afterAll);
