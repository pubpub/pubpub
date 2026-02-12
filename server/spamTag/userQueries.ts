import type * as types from 'types';
import type { SpamStatus, UserSpamTagFields } from 'types';

import mergeWith from 'lodash.mergewith';

import { SpamTag, User } from 'server/models';
import { sendSpamBanEmail, sendSpamLiftedEmail } from 'server/utils/email';
import { deleteSessionsForUser } from 'server/utils/session';
import { expect } from 'utils/assert';

import { getSuspectedUserSpamVerdict } from './userScore';

const mergeSpamTagFields = (
	spamTag: Pick<SpamTag, 'fields'> | { fields: UserSpamTagFields },
	fields?: UserSpamTagFields,
) => {
	if (!fields) {
		return spamTag;
	}
	if (!spamTag.fields) {
		return { ...spamTag, fields };
	}

	return {
		...spamTag,
		fields: mergeWith(spamTag.fields, fields, (a, b) => {
			if (Array.isArray(a) && Array.isArray(b)) {
				return a.concat(b);
			}
			return b ?? a;
		}),
	};
};

export const addSpamTagToUser = async (userId: string, fields?: UserSpamTagFields) => {
	const user = expect(
		await User.findOne({
			where: { id: userId },
			include: [{ model: SpamTag, as: 'spamTag' }],
		}),
	) as types.DefinitelyHas<User, 'spamTag'>;
	const verdict = getSuspectedUserSpamVerdict(user);
	const { spamTag } = user;
	if (spamTag) {
		// preserve existing fields, then layer on the new ones
		const withExisting = mergeSpamTagFields(verdict, spamTag.fields as UserSpamTagFields);
		const merged = mergeSpamTagFields(withExisting, fields);

		await spamTag.update(merged as types.SpamVerdict<SpamTag>);
		return spamTag;
	}
	const newMergedSpamTag = mergeSpamTagFields(verdict, fields);
	const newSpamTag = await SpamTag.create(newMergedSpamTag as types.SpamVerdict<SpamTag>);
	await User.update(
		{ spamTagId: newSpamTag.id },
		{
			where: { id: userId },
			limit: 1,
			individualHooks: false,
		},
	);
	return newSpamTag;
};

type UpdateSpamTagForUserOptions = {
	userId: string;
	status: SpamStatus;
};

export const getSpamTagForUser = async (userId: string) => {
	const user = await User.findOne({
		where: { id: userId },
		include: [{ model: SpamTag, as: 'spamTag' }],
	});
	if (!user) return null;
	const u = user as types.DefinitelyHas<User, 'spamTag'>;
	return u.spamTag ?? null;
};

export const updateSpamTagForUser = async (options: UpdateSpamTagForUserOptions) => {
	const { userId, status } = options;
	const spamTag = await getSpamTagForUser(userId);
	if (!spamTag) {
		throw new Error('User is missing a SpamTag');
	}
	await spamTag.update({ status, statusUpdatedAt: new Date() });
	await applySpamStatusSideEffects(userId, status);
};

const applySpamStatusSideEffects = async (userId: string, status: SpamStatus) => {
	const user = await User.findOne({
		where: { id: userId },
		attributes: ['email', 'fullName'],
	});
	if (!user?.email) return;
	try {
		if (status === 'confirmed-spam') {
			try {
				await deleteSessionsForUser(user.email);
			} catch (err) {
				console.error('Failed to delete sessions for banned user', userId, err);
			}
			await sendSpamBanEmail({ toEmail: user.email, userName: user.fullName ?? '' });
		} else if (status === 'confirmed-not-spam') {
			await sendSpamLiftedEmail({ toEmail: user.email, userName: user.fullName ?? '' });
		}
	} catch (err) {
		console.error('Failed to send spam status email', err);
	}
};

export const removeSpamTagFromUser = async (userId: string) => {
	const spamTag = await getSpamTagForUser(userId);
	if (spamTag) {
		await User.update(
			{ spamTagId: null },
			{ where: { id: userId }, limit: 1, individualHooks: false },
		);
		await spamTag.destroy();
	}
};
