import { setup, login, modelize, teardown } from 'stubstub';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

import { User, EmailChangeToken } from 'server/models';

const models = modelize`
    User user {
        email: "user@example.com"
        password: "password"
    }
    User otherUser {
        email: "other@example.com"
        password: "password"
    }
`;

// eslint-disable-next-line import/extensions
const mailgunMessages = require('server/utils/email/reset.ts').mg.messages;

setup(beforeAll, async () => {
	await models.resolve();

	// mock mailgun messages so we don't actually send emails in tests
	jest.spyOn(mailgunMessages, 'create').mockImplementation(
		() =>
			Promise.resolve({
				json: () => Promise.resolve({ status: 'ok', id: 'id' }),
			}) as unknown as Promise<Response>,
	);
});

beforeEach(async () => {
	// clean up any email change tokens before each test to avoid interference
	await EmailChangeToken.destroy({ where: {} });
});

afterEach(() => {
	jest.clearAllMocks();
});

teardown(afterAll);

describe('/api/account/email', () => {
	describe('POST /api/account/email - initiate email change', () => {
		it('allows a user to request an email change', async () => {
			const { user } = models;
			const agent = await login(user);
			const newEmail = 'newemail@example.com';

			const response = await agent
				.post('/api/account/email')
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
			expect(token?.usedAt).toBeNull();
		});

		it('invalidates old tokens when requesting a new email change', async () => {
			const { user } = models;
			const agent = await login(user);

			await agent
				.post('/api/account/email')
				.send({
					newEmail: 'first@example.com',
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			const firstToken = await EmailChangeToken.findOne({
				where: { userId: user.id },
				order: [['createdAt', 'ASC']],
			});
			expect(firstToken?.usedAt).toBeNull();

			// create second token
			await agent
				.post('/api/account/email')
				.send({
					newEmail: 'second@example.com',
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			// verify first token is now marked as used
			await firstToken?.reload();
			expect(firstToken?.usedAt).toBeDefined();

			// verify second token is not used
			const secondToken = await EmailChangeToken.findOne({
				where: { userId: user.id, usedAt: null },
			});
			expect(secondToken).toBeTruthy();
			expect(secondToken?.newEmail).toBe('second@example.com');
		});

		it('rejects email change with incorrect password', async () => {
			const { user } = models;
			const agent = await login(user);

			await agent
				.post('/api/account/email')
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
				.post('/api/account/email')
				.send({
					newEmail: otherUser.email,
					password: SHA3('password').toString(encHex),
				})
				.expect(400);
		});

		it('requires authentication to request email change', async () => {
			const agent = await login();

			await agent
				.post('/api/account/email')
				.send({
					newEmail: 'newemail@example.com',
					password: SHA3('password').toString(encHex),
				})
				.expect(403);
		});
	});

	// this is a bit finicky and requirs the tests to be in the correct order, bc changing email makes logging in again require a different email
	describe('PUT /api/account/email - complete email change', () => {
		it('rejects invalid token', async () => {
			const { user } = models;
			const agent = await login(user);

			await agent.put('/api/account/email').send({ token: 'invalid-token' }).expect(400);
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
				usedAt: null,
			});

			await agent.put('/api/account/email').send({ token: expiredToken.token }).expect(400);
		});

		it('rejects changing to an email that another user already has', async () => {
			const { user, otherUser } = models;
			const agent = await login(otherUser);

			// create a token for changing to otherUser's email
			const token = await EmailChangeToken.create({
				userId: otherUser.id,
				newEmail: user.email,
				token: 'collision-token',
				expiresAt: new Date(Date.now() + 1000 * 60 * 60),
				usedAt: null,
			});

			await agent.put('/api/account/email').send({ token: token.token }).expect(400);
		});

		it('allows completing email change with valid token', async () => {
			const { user } = models;
			const agent = await login(user);
			const newEmail = 'completed@example.com';

			await agent
				.post('/api/account/email')
				.send({
					newEmail,
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			const token = await EmailChangeToken.findOne({
				where: { userId: user.id, usedAt: null },
			});
			expect(token).toBeTruthy();

			// complete email change
			const response = await agent
				.put('/api/account/email')
				.send({ token: token?.token })
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.newEmail).toBe(newEmail);

			// verify email was changed
			const updatedUser = await User.findOne({ where: { id: user.id } });
			expect(updatedUser?.email).toBe(newEmail);

			// verify token is marked as used
			await token?.reload();
			expect(token?.usedAt).not.toBeNull();
		});

		it('rejects already-used token', async () => {
			const { otherUser } = models;
			const agent = await login(otherUser);
			const newEmail = 'usedtoken@example.com';

			const initiateResponse = await agent
				.post('/api/account/email')
				.send({
					newEmail,
					password: SHA3('password').toString(encHex),
				})
				.expect(200);

			expect(initiateResponse.status).toBe(200);

			const token = await EmailChangeToken.findOne({
				where: { userId: otherUser.id },
				order: [['createdAt', 'DESC']],
			});

			await agent
				.put('/api/account/email')
				.send({ token: token?.token })
				.expect(200);

			// try to use same token again
			await agent
				.put('/api/account/email')
				.send({ token: token?.token })
				.expect(400);
		});
	});
});
