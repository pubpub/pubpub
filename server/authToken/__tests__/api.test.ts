import { modelize, teardown, setup, login } from 'stubstub';

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

    Community anotherCommunity {
        Member {
            permissions: "admin"
            User anotherCommunityAdmin {
                id: "530cf446-f220-4e51-b6ba-68def3f5a8b5"
            }
        }

        AuthToken anotherAuthToken {
            expiresAt: null
            userId: "530cf446-f220-4e51-b6ba-68def3f5a8b5"
        }
    }
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
		return {};
	}

	return result.json();
};

let port: string;

describe('authToken', () => {
	it('should be possible for an admin to create a token', async () => {
		const { community, communityAdmin } = models;

		const agent = await login(communityAdmin);

		const result = await agent
			.post(`/api/authTokens`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.send({ expiresAt: 'never', communityId: community.id })
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
			.post(`/api/authTokens`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.send({ expiresAt: 'never', communityId: community.id })
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

	// any other tests you want to write

	it("should not be possible for an admin to delete another community's admins token", async () => {
		const { adminToken, community, anotherAuthToken } = models;

		await fetchWithToken(
			adminToken.token,
			community,
			`http://localhost:${port}/api/authTokens/${anotherAuthToken.id}`,
			404,
			{ method: 'DELETE' },
		);
	});

	it('should be possible for an admin to delete a token', async () => {
		const { adminToken, community } = models;

		await fetchWithToken(
			adminToken.token,
			community,
			`http://localhost:${port}/api/authTokens/${adminToken.id}`,
			200,
			{ method: 'DELETE' },
		);
	});

	test.todo(
		'users should always we able to remove their own tokens, even if they are no longer admins',
	);

	test.todo('admins should not be able to remove tokens from other users');

	test.todo('superadmins should be able to revoke tokens');
});
