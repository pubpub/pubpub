import * as types from 'types';

import { communitySpamPhrases } from './phrases';

const CURRENT_SPAM_SCORE_VERSION = 1;

const getStringSpamScore = (text: types.Maybe<string>): number => {
	if (text) {
		const matches = communitySpamPhrases.filter((phrase) =>
			text.toLowerCase().includes(phrase.toLowerCase()),
		);
		return matches.length;
	}
	return 0;
};

const getCommunitySpamScore = (community: types.Community) => {
	const {
		title,
		description,
		subdomain,
		heroTitle,
		heroText,
		heroPrimaryButton,
		heroSecondaryButton,
		website,
		email,
		publishAs,
		citeAs,
	} = community;
	return [
		title,
		description,
		subdomain,
		heroText,
		heroTitle,
		heroPrimaryButton?.title,
		heroSecondaryButton?.title,
		website,
		email,
		publishAs,
		citeAs,
	]
		.map((value) => getStringSpamScore(value))
		.reduce((a, b) => a + b, 0);
};

export const getSuspectedCommunitySpamVerdict = (community: types.Community): types.SpamVerdict => {
	const spamScore = getCommunitySpamScore(community);
	return {
		spamScore,
		status: spamScore > 0 ? 'suspected-spam' : 'suspected-not-spam',
		spamScoreVersion: CURRENT_SPAM_SCORE_VERSION,
		spamScoreComputedAt: new Date().toISOString(),
	};
};
