import { modelize, teardown, setup, login } from 'stubstub';

const COMMUNITY_ID = '9138e6f5-68a1-4f35-98a5-aa962091fc30' as const;
const ADMIN_USER_ID = '430cf446-f220-4e51-b6ba-68def3f5a8b5' as const;
const MANAGE_USER_ID = '930cf446-f220-4e51-b6ba-68def3f5a8b5' as const;

const models = modelize`
    Community community {
       Member {
            permissions: "admin"
            User communityAdmin {
                id: "430cf446-f220-4e51-b6ba-68def3f5a8b5"
            }
       }

       AuthToken adminToken {
            expiresAt: null
            userId: "430cf446-f220-4e51-b6ba-68def3f5a8b5"
       }

       AuthToken expiredToken {
            expiresAt: "2021-01-01T00:00:00.000Z"
            userId: "430cf446-f220-4e51-b6ba-68def3f5a8b5"
       }

       Member {
            permissions: "manage"
            User communityManager {
                id: "930cf446-f220-4e51-b6ba-68def3f5a8b5"
            }
       }

       AuthToken manageToken {
            expiresAt: null
            userId: "930cf446-f220-4e51-b6ba-68def3f5a8b5"
       }
    }

    Community anotherCommunity {}
`;

setup(beforeAll, async () => {
	await models.resolve();
});

teardown(afterAll);

const fetchWithToken = async (
	token: string,
	community: { subdomain: string },
	url: string,
	expectedStatus: number,
	config?: any,
) => {
	const result = await fetch(url, {
		...config,
		headers: {
			...config?.headers,
			Authorization: `Bearer ${token}`,
			communityhostname: `${community.subdomain}.pubpub.org`,
		},
	});

	expect(result.status).toBe(expectedStatus);

	if (!result.ok) {
		return;
	}

	return result.json();
};

let port: string;

describe('authToken', () => {
	it('should be possible for an admin to create a token', async () => {
		const { community, communityAdmin } = models;

		const agent = await login(communityAdmin);

		const result = await agent
			.post(`/api/authToken`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.send({ expiresAt: 'never' })
			.expect(201);

		// @ts-expect-error shh
		port = result.req.path.match(/:(\d+)/)[1];
	});

	it('should be possible for an admin to use a token to access admin only routes', async () => {
		const { adminToken, community } = models;

		const result = await fetchWithToken(
			adminToken.token,
			community,
			`http://localhost:${port}/api/members`,
			200,
		);

		expect(result.length).toBeGreaterThan(0);
	});

	it('should not be possible for a non-admin to create a token', async () => {
		const { community, communityManager } = models;

		const agent = await login(communityManager);

		await agent
			.post(`/api/authToken`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.send({ expiresAt: 'never' })
			.expect(403);
	});

	it('should not be possible for a non-admin to use a token to access admin only routes', async () => {
		const { manageToken, community } = models;

		await fetchWithToken(
			manageToken.token,
			community,
			`http://localhost:${port}/api/members`,
			403,
		);
	});

	it('should not be possible to use a token for a different community', async () => {
		const { adminToken, anotherCommunity } = models;

		await fetchWithToken(
			adminToken.token,
			anotherCommunity,
			`http://localhost:${port}/api/members`,
			403,
		);
	});

	it('should throw an error for expired tokens', async () => {
		const { expiredToken, community } = models;

		await fetchWithToken(
			expiredToken.token,
			community,
			`http://localhost:${port}/api/members`,
			403,
		);
	});
});
