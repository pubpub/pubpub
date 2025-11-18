import { setup, login, modelize, teardown } from 'stubstub';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

import { User, EmailChangeToken } from 'server/models';

const models = modelize`
    User user {
        email: "user@example.com"
    }
    User otherUser {
        email: "other@example.com"
    }
`;

setup(beforeAll, models.resolve);
teardown(afterAll);

describe('/api/user/email', () => {
	describe('POST /api/user/email - initiate email change', () => {
		it('allows a user to request an email change', async () => {
			const { user } = models;
			const agent = await login(user);
			const newEmail = 'newemail@example.com';

			const response = await agent
				.post('/api/user/email')
				.send({
					newEmail,
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			expect(response.body.success).toBe(true);

			// verify token was created
			const token = await EmailChangeToken.findOne({ where: { userId: user.id } });
			expect(token).toBeTruthy();
			expect(token?.newEmail).toBe(newEmail);
			expect(token?.used).toBe(false);
		});

		it('invalidates old tokens when requesting a new email change', async () => {
			const { user } = models;
			const agent = await login(user);

			// create first token
			await agent
				.post('/api/user/email')
				.send({
					newEmail: 'first@example.com',
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			const firstToken = await EmailChangeToken.findOne({
				where: { userId: user.id },
				order: [['createdAt', 'ASC']],
			});
			expect(firstToken?.used).toBe(false);

			// create second token
			await agent
				.post('/api/user/email')
				.send({
					newEmail: 'second@example.com',
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			// verify first token is now marked as used
			await firstToken?.reload();
			expect(firstToken?.used).toBe(true);

			// verify second token is not used
			const secondToken = await EmailChangeToken.findOne({
				where: { userId: user.id, used: false },
			});
			expect(secondToken).toBeTruthy();
			expect(secondToken?.newEmail).toBe('second@example.com');
		});

		it('rejects email change with incorrect password', async () => {
			const { user } = models;
			const agent = await login(user);

			await agent
				.post('/api/user/email')
				.send({
					newEmail: 'newemail@example.com',
					password: SHA3('wrongpassword').toString(encHex),
				})
				.expect(403);
		});

		it('rejects email change to an already-used email', async () => {
			const { user, otherUser } = models;
			const agent = await login(user);

			await agent
				.post('/api/user/email')
				.send({
					newEmail: otherUser.email,
					password: SHA3('password').toString(encHex),
				})
				.expect(400);
		});

		it('requires authentication to request email change', async () => {
			const agent = await login();

			await agent
				.post('/api/user/email')
				.send({
					newEmail: 'newemail@example.com',
					password: SHA3('password').toString(encHex),
				})
				.expect(403);
		});
	});

	describe('PUT /api/user/email - complete email change', () => {
		it('allows completing email change with valid token', async () => {
			const { user } = models;
			const agent = await login(user);
			const newEmail = 'completed@example.com';

			// initiate email change
			await agent
				.post('/api/user/email')
				.send({
					newEmail,
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			const token = await EmailChangeToken.findOne({
				where: { userId: user.id, used: false },
			});
			expect(token).toBeTruthy();

			// complete email change
			const response = await agent
				.put('/api/user/email')
				.send({ token: token?.token })
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.newEmail).toBe(newEmail);

			// verify email was changed
			const updatedUser = await User.findOne({ where: { id: user.id } });
			expect(updatedUser?.email).toBe(newEmail);

			// verify token is marked as used
			await token?.reload();
			expect(token?.used).toBe(true);
		});

		it('rejects invalid token', async () => {
			const agent = await login();

			await agent
				.put('/api/user/email')
				.send({ token: 'invalid-token' })
				.expect(400);
		});

		it('rejects already-used token', async () => {
			const { user } = models;
			const agent = await login(user);
			const newEmail = 'usedtoken@example.com';

			// initiate and complete email change
			await agent
				.post('/api/user/email')
				.send({
					newEmail,
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			const token = await EmailChangeToken.findOne({
				where: { userId: user.id },
				order: [['createdAt', 'DESC']],
			});

			await agent.put('/api/user/email').send({ token: token?.token }).expect(200);

			// try to use same token again
			await agent.put('/api/user/email').send({ token: token?.token }).expect(400);
		});

		it('rejects expired token', async () => {
			const { user } = models;
			const agent = await login(user);

			// create an expired token directly
			const expiredToken = await EmailChangeToken.create({
				userId: user.id,
				newEmail: 'expired@example.com',
				token: 'expired-token-hash',
				expiresAt: new Date(Date.now() - 1000),
				used: false,
			});

			await agent
				.put('/api/user/email')
				.send({ token: expiredToken.token })
				.expect(400);
		});

		it('rejects changing to an email that another user already has', async () => {
			const { user, otherUser } = models;
			const agent = await login(user);

			// create a token for changing to otherUser's email
			const token = await EmailChangeToken.create({
				userId: user.id,
				newEmail: otherUser.email,
				token: 'collision-token',
				expiresAt: new Date(Date.now() + 1000 * 60 * 60),
				used: false,
			});

			await agent.put('/api/user/email').send({ token: token.token }).expect(400);
		});
	});
});

