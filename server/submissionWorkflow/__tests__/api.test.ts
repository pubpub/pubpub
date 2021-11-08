/* global it, expect, beforeAll, afterAll */
import { setup, teardown, login, modelize } from 'stubstub';

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

it('creates a new submission workflow', async () => {
	const { admin, community, collection } = models;
	const agent = await login(admin);
	const {
		body: { enabled, targetEmailAddress, collectionId },
	} = await agent
		.post('/api/submissionWorkflows')
		.send({
			collectionId: collection.id,
			communityId: community.id,
			enabled: true,
			targetEmailAddress: 'finnandjakeforwvwer@adventuretime.com',
		})
		.expect(201);

	expect(collectionId).toEqual(collection.id);
	expect(enabled).toEqual(true);
	expect(targetEmailAddress).toEqual('finnandjakeforwvwer@adventuretime.com');
});

teardown(afterAll);
