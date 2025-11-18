import { promisify } from 'util';

import app, { wrap } from 'server/server';
import { User } from 'server/models';
import { ForbiddenError } from 'server/utils/errors';

type ChangePasswordInput = {
	currentPassword: string;
	newPassword: string;
};

export const changePassword = async (
	inputValues: ChangePasswordInput,
	userId: string | undefined,
) => {
	if (!userId) {
		throw new ForbiddenError(new Error('Must be logged in to change password'));
	}

	const userData = await User.findOne({ where: { id: userId } });

	if (!userData) {
		throw new ForbiddenError(new Error('User not found'));
	}

	return new Promise<void>((resolve, reject) => {
		(userData as any).authenticate(inputValues.currentPassword, async (err: any, authUser: any) => {
			if (err || !authUser) {
				return reject(new ForbiddenError(new Error('Current password is incorrect')));
			}

			try {
				const setPassword = promisify(userData.setPassword.bind(userData));
				const updatedUser = await setPassword(inputValues.newPassword);

				await User.update(
					{
						hash: updatedUser?.dataValues.hash,
						salt: updatedUser?.dataValues.salt,
						passwordDigest: 'sha512',
					},
					{ where: { id: userId } },
				);

				resolve();
			} catch (error) {
				reject(error);
			}
		});
	});
};

app.put(
	'/api/user/password',
	wrap(async (req, res) => {
		const user = req.user || {};
		try {
			await changePassword(req.body, user.id);
			return res.status(200).json({ success: true });
		} catch (err: any) {
			console.error('Error in changePassword: ', err);
			return res.status(err.status || 500).json({ message: err.message });
		}
	}),
);

