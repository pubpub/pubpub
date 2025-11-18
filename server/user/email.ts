import app, { wrap } from 'server/server';
import { User, EmailChangeToken } from 'server/models';
import { ForbiddenError, BadRequestError } from 'server/utils/errors';
import { generateHash } from 'utils/hashes';
import { sendEmailChangeEmail } from 'server/utils/email';

type InitiateEmailChangeInput = {
	newEmail: string;
	password: string;
};

type CompleteEmailChangeInput = {
	token: string;
};

export const initiateEmailChange = async (
	inputValues: InitiateEmailChangeInput,
	userId: string | undefined,
	hostname: string,
) => {
	if (!userId) {
		throw new ForbiddenError(new Error('Must be logged in to change email'));
	}

	const newEmail = inputValues.newEmail.toLowerCase().trim();

	const existingUser = await User.findOne({ where: { email: newEmail } });
	if (existingUser) {
		throw new BadRequestError(new Error('An account with this email already exists'));
	}

	const userData = await User.findOne({ where: { id: userId } });

	if (!userData) {
		throw new ForbiddenError(new Error('User not found'));
	}

	return new Promise<void>((resolve, reject) => {
		(userData as any).authenticate(inputValues.password, async (err: any, authUser: any) => {
			if (err || !authUser) {
				reject(new ForbiddenError(new Error('Password is incorrect')));
				return;
			}

			try {
				const token = generateHash();
				const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

				// invalidate any existing unused tokens for this user
				await EmailChangeToken.update(
					{ used: true },
					{
						where: {
							userId,
							used: false,
						},
					},
				);

				// create new email change token
				await EmailChangeToken.create({
					userId,
					newEmail,
					token,
					expiresAt,
					used: false,
				});

				await sendEmailChangeEmail({
					toEmail: newEmail,
					changeUrl: `https://${hostname}/email-change/${token}`,
				});

				resolve();
			} catch (error) {
				reject(error);
			}
		});
	});
};

export const completeEmailChange = async (inputValues: CompleteEmailChangeInput) => {
	const { token } = inputValues;
	const currentTime = Date.now();

	const emailChangeToken = await EmailChangeToken.findOne({
		where: { token, used: false },
	});

	if (!emailChangeToken) {
		throw new BadRequestError(new Error('Invalid or expired email change link'));
	}

	if (Number(emailChangeToken.expiresAt) < currentTime) {
		throw new BadRequestError(new Error('Email change link has expired'));
	}

	const newEmail = emailChangeToken.newEmail.toLowerCase().trim();
	const userId = emailChangeToken.userId;

	const existingUser = await User.findOne({ where: { email: newEmail } });
	if (existingUser && existingUser.id !== userId) {
		throw new BadRequestError(new Error('An account with this email already exists'));
	}

	// mark token as used
	await EmailChangeToken.update({ used: true }, { where: { id: emailChangeToken.id } });

	// update user email
	await User.update({ email: newEmail }, { where: { id: userId } });

	return { newEmail };
};

app.post(
	'/api/user/email',
	wrap(async (req, res) => {
		const user = req.user || {};
		try {
			await initiateEmailChange(req.body, user.id, req.hostname);
			return res.status(200).json({ success: true });
		} catch (err: any) {
			console.error('Error in initiateEmailChange: ', err);
			return res.status(err.status || 500).json({ message: err.message });
		}
	}),
);

app.put(
	'/api/user/email',
	wrap(async (req, res) => {
		try {
			const result = await completeEmailChange(req.body);
			return res.status(200).json({ success: true, newEmail: result.newEmail });
		} catch (err: any) {
			console.error('Error in completeEmailChange: ', err);
			return res.status(err.status || 500).json({ message: err.message });
		}
	}),
);
