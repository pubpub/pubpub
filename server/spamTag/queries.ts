import * as types from 'types';
import { Community, SpamTag } from 'server/models';

import { getSuspectedCommunitySpamVerdict } from './score';

// Adding a spam tag doesn't imply that the Community _is_ spam, only that we have a score for it.
export const addSpamTagToCommunity = async (communityId: string) => {
	const community: types.SequelizeModel<types.DefinitelyHas<types.Community, 'spamTag'>> =
		await Community.findOne({
			where: { id: communityId },
			include: [{ model: SpamTag, as: 'spamTag' }],
		});
	const { spamTag } = community;
	const verdict = getSuspectedCommunitySpamVerdict(community);
	if (spamTag) {
		// Be paranoid: never transition from suspected-spam or confirmed-anything to another state.
		if (spamTag.status === 'suspected-not-spam') {
			await (spamTag as types.SequelizeModel<types.SpamTag>).update(verdict);
		}
		return spamTag;
	}
	const newSpamTag = await SpamTag.create(verdict);
	// Using the model singleton here so the Community.afterUpdate hook won't be triggered.
	await Community.update({ spamTagId: newSpamTag.id }, { where: { id: communityId }, limit: 1 });
	return newSpamTag;
};
