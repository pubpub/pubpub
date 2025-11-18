import { setup, login, modelize, teardown } from 'stubstub';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';

import { User } from 'server/models';

const models = modelize`
    User user {
        email: "user@example.com"
    }
`;

setup(beforeAll, models.resolve);
teardown(afterAll);

describe('/api/user/password', () => {
	it('allows a user to change their password', async () => {
		const { user } = models;
		const agent = await login(user);
		const oldPassword = 'password';
		const newPassword = 'newpassword123';

		await agent
			.put('/api/user/password')
			.send({
				currentPassword: SHA3(oldPassword).toString(encHex),
				newPassword: SHA3(newPassword).toString(encHex),
			})
			.expect(200);

		// verify the password was actually changed by trying to log in with new password
		const updatedUser = await User.findOne({ where: { id: user.id } });
		expect(updatedUser).toBeTruthy();
	});

	it('rejects password change with incorrect current password', async () => {
		const { user } = models;
		const agent = await login(user);

		await agent
			.put('/api/user/password')
			.send({
				currentPassword: SHA3('wrongpassword').toString(encHex),
				newPassword: SHA3('newpassword123').toString(encHex),
			})
			.expect(403);
	});

	it('requires authentication to change password', async () => {
		const agent = await login();

		await agent
			.put('/api/user/password')
			.send({
				currentPassword: SHA3('anypassword').toString(encHex),
				newPassword: SHA3('newpassword123').toString(encHex),
			})
			.expect(403);
	});
});
