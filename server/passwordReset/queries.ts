import { promisify } from 'util';

import * as types from 'types';
import { User } from 'server/models';
import { generateHash } from 'utils/hashes';
import { sendPasswordResetEmail } from 'server/utils/email';

type CreatePasswordResetInputValues = {
	email: string;
};

type UpdatePasswordResetInputValues = {
	resetHash: string;
	slug: string;
	password: string;
};

export const createPasswordReset = (
	inputValues: CreatePasswordResetInputValues,
	user: types.User,
	hostname: string,
) => {
	const email = inputValues.email;

	return User.findOne({
		where: email ? { email } : { id: user.id },
	})
		.then((userData) => {
			if (!userData) {
				throw new Error("User doesn't exist");
			}

			const updateData = {
				resetHash: generateHash(),
				resetHashExpiration: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 24 hours.
			};
			return User.update(updateData, {
				where: { id: userData.id },
				returning: true,
				individualHooks: true,
			});
		})
		.then((updatedUserData) => {
			const updatedUser = updatedUserData[1][0];
			return sendPasswordResetEmail({
				toEmail: updatedUser.email,
				resetUrl: `https://${hostname}/password-reset/${updatedUser.resetHash}/${updatedUser.slug}`,
			});
		});
};

export const updatePasswordReset = (
	inputValues: UpdatePasswordResetInputValues,
	user: types.User,
) => {
	const resetHash = inputValues.resetHash;
	const slug = inputValues.slug;
	const currentTime = Date.now();

	const whereQuery = user.id ? { id: user.id } : { resetHash, slug };

	return User.findOne({
		where: whereQuery,
	})
		.then((userData) => {
			if (!userData) {
				throw new Error("User doesn't exist");
			}
			if (
				!user.id &&
				resetHash &&
				userData.resetHashExpiration &&
				Number(userData.resetHashExpiration) < currentTime
			) {
				throw new Error('Hash is expired');
			}

			/* Promisify the setPassword function, and use .update to match API convention */
			const setPassword = promisify(userData.setPassword.bind(userData));
			return setPassword(inputValues.password);
		})
		.then((passwordResetData) => {
			const updateData = {
				hash: passwordResetData?.dataValues.hash,
				salt: passwordResetData?.dataValues.salt,
				resetHash: '',
				resetHashExpiration: new Date(currentTime),
				passwordDigest: 'sha512',
			};
			return User.update(updateData, {
				where: whereQuery,
			});
		});
};
