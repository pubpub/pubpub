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

describe('authToken', () => {
	it('should be possible for an admin to create a token', async () => {
		const { community, communityAdmin } = models;

		const agent = await login(communityAdmin);

		await agent
			.post(`/api/authTokens`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.send({ expiresAt: 'never', communityId: community.id })
			.expect(201);
	});

	it('should be possible for an admin to use a token to access admin only routes', async () => {
		const { adminToken, community } = models;

		const agent = await login();
		const result = await agent
			.get('/api/members')
			.set('Authorization', `Bearer ${adminToken.token}`)
			.set('communityhostname', `${community.subdomain}.pubpub.org`)
			.expect(200);

		expect(result.body.length).toBeGreaterThan(0);
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

		await (await login())
			.get('/api/members')
			.set('Authorization', `Bearer ${manageToken.token}`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.expect(403);
		//		await fetchWithToken(manageToken.token, community, `/api/members`, 403);
	});

	it('should not be possible to use a token for a different community', async () => {
		const { adminToken, anotherCommunity } = models;

		await (await login())
			.get('/api/members')
			.set('Authorization', `Bearer ${adminToken.token}`)
			.set('Host', `${anotherCommunity.subdomain}.pubpub.org`)
			.expect(403);
	});

	it('should throw an error for expired tokens', async () => {
		const { expiredToken, community } = models;

		await (await login())
			.get('/api/members')
			.set('Authorization', `Bearer ${expiredToken.token}`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.expect(403);
	});

	it("should not be possible for an admin to delete another community's admins token", async () => {
		const { adminToken, community, anotherAuthToken } = models;

		await (await login())
			.delete(`/api/authTokens/${anotherAuthToken.id}`)
			.set('Authorization', `Bearer ${adminToken.token}`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.expect(404);
	});

	it('should be possible for an admin to delete a token', async () => {
		const { adminToken, community } = models;

		await (await login())
			.delete(`/api/authTokens/${adminToken.id}`)
			.set('Authorization', `Bearer ${adminToken.token}`)
			.set('Host', `${community.subdomain}.pubpub.org`)
			.send()
			.expect(200);
	});

	test.todo(
		'users should always we able to remove their own tokens, even if they are no longer admins',
	);

	test.todo('admins should not be able to remove tokens from other users');

	test.todo('superadmins should be able to revoke tokens');
});
