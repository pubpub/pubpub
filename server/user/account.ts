import { promisify } from 'util';
import { initServer } from '@ts-rest/express';

import { User, EmailChangeToken } from 'server/models';
import { generateHash } from 'utils/hashes';
import { sendEmailChangeEmail } from 'server/utils/email';
import { contract } from 'utils/api/contract';

const s = initServer();

export const accountServer = s.router(contract.account, {
	changePassword: async ({ req, body }) => {
		const userId = req.user?.id;

		if (!userId) {
			return {
				status: 403,
				body: { message: 'Must be logged in to change password' },
			};
		}

		const userData = await User.findOne({ where: { id: userId } });

		if (!userData) {
			return {
				status: 403,
				body: { message: 'User not found' },
			};
		}

		return new Promise<
			{ status: 200; body: { success: true } } | { status: 403; body: { message: string } }
		>((resolve) => {
			(userData as any).authenticate(
				body.currentPassword,
				async (err: any, authUser: any) => {
					if (err || !authUser) {
						resolve({
							status: 403,
							body: { message: 'Current password is incorrect' },
						});
						return;
					}

					try {
						const setPassword = promisify(userData.setPassword.bind(userData));
						const updatedUser = await setPassword(body.newPassword);

						await User.update(
							{
								hash: updatedUser?.dataValues.hash,
								salt: updatedUser?.dataValues.salt,
								passwordDigest: 'sha512',
							},
							{ where: { id: userId } },
						);

						resolve({ status: 200, body: { success: true } });
					} catch (error) {
						resolve({
							status: 403,
							body: { message: 'Failed to change password' },
						});
					}
				},
			);
		});
	},

	initiateEmailChange: async ({ req, body }) => {
		const userId = req.user?.id;

		if (!userId) {
			return {
				status: 403,
				body: { message: 'Must be logged in to change email' },
			};
		}

		const newEmail = body.newEmail.toLowerCase().trim();

		const existingUser = await User.findOne({ where: { email: newEmail } });
		if (existingUser) {
			return {
				status: 400,
				body: { message: 'An account with this email already exists' },
			};
		}

		const userData = await User.findOne({ where: { id: userId } });

		if (!userData) {
			return {
				status: 403,
				body: { message: 'User not found' },
			};
		}

		return new Promise<
			| { status: 200; body: { success: true } }
			| { status: 400; body: { message: string } }
			| { status: 403; body: { message: string } }
		>((resolve) => {
			(userData as any).authenticate(body.password, async (err: any, authUser: any) => {
				if (err || !authUser) {
					resolve({
						status: 403,
						body: { message: 'Password is incorrect' },
					});
					return;
				}

				try {
					const token = generateHash();
					const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

					// invalidate any existing unused tokens for this user
					await EmailChangeToken.update(
						{ usedAt: new Date() },
						{
							where: {
								userId,
								usedAt: null,
							},
						},
					);

					// create new email change token
					await EmailChangeToken.create({
						userId,
						newEmail,
						token,
						expiresAt,
						usedAt: null,
					});

					await sendEmailChangeEmail({
						toEmail: newEmail,
						changeUrl: `https://${req.hostname}/email-change/${token}`,
					});

					resolve({ status: 200, body: { success: true } });
				} catch (error) {
					resolve({
						status: 400,
						body: { message: 'Failed to initiate email change' },
					});
				}
			});
		});
	},

	completeEmailChange: async ({ body }) => {
		const { token } = body;
		const currentTime = Date.now();

		const emailChangeToken = await EmailChangeToken.findOne({
			where: { token, usedAt: null },
		});

		if (!emailChangeToken) {
			return {
				status: 400,
				body: { message: 'Invalid or expired email change link' },
			};
		}

		if (Number(emailChangeToken.expiresAt) < currentTime) {
			return {
				status: 400,
				body: { message: 'Email change link has expired' },
			};
		}

		const newEmail = emailChangeToken.newEmail.toLowerCase().trim();
		const userId = emailChangeToken.userId;

		const existingUser = await User.findOne({ where: { email: newEmail } });
		if (existingUser && existingUser.id !== userId) {
			return {
				status: 400,
				body: { message: 'An account with this email already exists' },
			};
		}

		// mark token as used
		await EmailChangeToken.update(
			{ usedAt: new Date() },
			{ where: { id: emailChangeToken.id } },
		);

		// update user email
		await User.update({ email: newEmail }, { where: { id: userId } });

		return { status: 200, body: { success: true, newEmail } };
	},
});
