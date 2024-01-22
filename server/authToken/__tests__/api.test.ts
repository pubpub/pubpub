import { modelize, teardown, setup, login } from 'stubstub';

const COMMUNITY_ID = '9138e6f5-68a1-4f35-98a5-aa962091fc30' as const;
const ADMIN_USER_ID = '430cf446-f220-4e51-b6ba-68def3f5a8b5' as const;
const MANAGE_USER_ID = '930cf446-f220-4e51-b6ba-68def3f5a8b5' as const;

const models = modelize`
    Community community {
       id: "${COMMUNITY_ID}" 
       Member {
            permissions: "admin"
            User communityAdmin {
                id: "${ADMIN_USER_ID}"
            }
       }

       AuthToken adminToken {
            expiresAt: null
            userId: "${ADMIN_USER_ID}"
       }

       Member {
            permissions: "manage"
            User communityManager {
                id: "${MANAGE_USER_ID}"
            }
       }

       AuthToken manageToken {
            expiresAt: null
            userId: "${MANAGE_USER_ID}"
       }
    }
`;

setup(beforeAll, async () => {
	await models.resolve();
});

teardown(afterAll);

const fetchWithToken = async (token: string, url: string, config?: any) =>
	(
		await fetch(url, {
			...config,
			headers: {
				...config?.headers,
				Authorization: `Bearer ${token}`,
			},
		})
	).json();

let port;
describe('authToken', () => {
	it('should be possible for an admin to create a token', async () => {
		const { community, communityAdmin } = models;

		const agent = await login(communityAdmin);

		const result = await agent
			.post(`/api/authToken`)
			.set('Host', `${community.slug}.pubpub.org`)
			.send({ expiresAt: 'never' })
			.expect(201);

		console.log(agent);
	});

	it('should be possible for an admin to use a token to access admin only routes', async () => {
		const { adminToken } = models;
	});
});
