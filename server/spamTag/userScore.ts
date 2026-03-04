import type * as types from 'types';
import type { DocJson, Maybe } from 'types';

import { Member, type SpamTag, ThreadComment, type User } from 'server/models';

import {
	containsLink,
	extractLinksFromDocJson,
	extractLinksFromText,
	matchesCommentSpamTemplate,
} from './contentAnalysis';
import { communitySpamPhrases } from './phrases';

const CURRENT_SPAM_SCORE_VERSION = 2;

type SpamField<T> = {
	extract: (value: T) => Maybe<string>;
	isProse: boolean;
	weight: number;
};

const profileSpamFields: Record<string, SpamField<User>> = {
	fullName: { extract: (u) => u.fullName, isProse: true, weight: 1 },
	title: { extract: (u) => u.title, isProse: true, weight: 1 },
	bio: { extract: (u) => u.bio, isProse: true, weight: 1 },
};

const getMatchingSpamPhrases = (text: string, isProse: boolean): string[] => {
	if (!text) return [];
	return communitySpamPhrases.filter((phrase) => {
		const lower = text.toLowerCase();
		const lowerPhrase = phrase.toLowerCase();
		if (isProse) {
			return lower.includes(' ' + lowerPhrase) || lower.includes(lowerPhrase + ' ');
		}
		return lower.includes(lowerPhrase);
	});
};

const getProfilePhraseScore = (user: User) => {
	return Object.keys(profileSpamFields).reduce(
		(report, key) => {
			const { extract, weight, isProse } = profileSpamFields[key];
			const text = extract(user);
			if (!text) return report;
			const matches = getMatchingSpamPhrases(text, isProse);
			if (matches.length === 0) return report;
			return {
				score: report.score + weight * matches.length,
				fields: { ...report.fields, [key]: matches },
			};
		},
		{ score: 0, fields: {} as Record<string, string[]> },
	);
};

type UserCommentData = {
	totalComments: number;
	commentsWithLinks: number;
	linkUrls: string[];
	templateMatches: string[];
	commentsWithLinksAndTemplates: number;
};

const getUserCommentData = async (userId: string): Promise<UserCommentData> => {
	const comments = await ThreadComment.findAll({
		where: { userId },
		attributes: ['content', 'text'],
		limit: 200,
	});
	let commentsWithLinks = 0;
	let commentsWithLinksAndTemplates = 0;
	const allLinkUrls: string[] = [];
	const allTemplateMatches: string[] = [];

	for (const comment of comments) {
		const doc = comment.content as DocJson | null;
		const text = comment.text;
		const hasLink = containsLink(doc, text);

		if (hasLink) {
			commentsWithLinks++;
			const docLinks = extractLinksFromDocJson(doc);
			const textLinks = extractLinksFromText(text);
			allLinkUrls.push(...docLinks, ...textLinks);
		}

		const templates = matchesCommentSpamTemplate(text);
		if (templates.length > 0) {
			allTemplateMatches.push(...templates);
			if (hasLink) {
				commentsWithLinksAndTemplates++;
			}
		}
	}

	return {
		totalComments: comments.length,
		commentsWithLinks,
		linkUrls: [...new Set(allLinkUrls)],
		templateMatches: [...new Set(allTemplateMatches)],
		commentsWithLinksAndTemplates,
	};
};

export type UserSpamReport = {
	score: number;
	fields: Record<string, string[]>;
	signals: string[];
};

export const computeUserSpamReport = async (user: User): Promise<UserSpamReport> => {
	const fields: Record<string, string[]> = {};
	const signals: string[] = [];
	let score = 0;

	const profileResult = getProfilePhraseScore(user);
	if (profileResult.score > 0) {
		score += profileResult.score;
		Object.assign(fields, profileResult.fields);
		signals.push('profile-spam-phrases');
	}

	const hasWebsite = !!user.website;
	const bioHasUrl = extractLinksFromText(user.bio).length > 0;

	const memberCount = await Member.count({ where: { userId: user.id } });

	if (hasWebsite && memberCount === 0) {
		score += 3;
		fields.website = [user.website!];
		signals.push('website-no-memberships');
	}

	if (hasWebsite) {
		const createdAt = new Date(user.createdAt as unknown as string).getTime();
		const updatedAt = new Date(user.updatedAt as unknown as string).getTime();
		const timeDiffMinutes = (updatedAt - createdAt) / 60_000;
		if (timeDiffMinutes < 5) {
			score += 3;
			if (!fields.website) fields.website = [user.website!];
			signals.push('website-added-quickly');
		}
	}

	if (bioHasUrl) {
		score += 2;
		fields.bioUrl = extractLinksFromText(user.bio);
		signals.push('bio-contains-url');
	}

	const commentData = await getUserCommentData(user.id);

	if (commentData.commentsWithLinks > 0 && memberCount === 0) {
		score += 4;
		fields.suspiciousCommentLinks = commentData.linkUrls.slice(0, 10);
		signals.push('comments-with-links-no-memberships');
	}

	if (
		commentData.totalComments > 0 &&
		commentData.commentsWithLinks === commentData.totalComments
	) {
		score += 2;
		signals.push('all-comments-have-links');
	}

	if (commentData.commentsWithLinksAndTemplates > 0) {
		score += 2;
		fields.templateSpamComments = commentData.templateMatches.slice(0, 10);
		signals.push('template-spam-with-links');
	}

	return { score, fields, signals };
};

// the original synchronous scoring for backward compatibility with existing callers
// that don't need the full async analysis
export const getSuspectedUserSpamVerdict = (user: User): types.SpamVerdict<SpamTag> => {
	const { score, fields } = getProfilePhraseScore(user);
	return {
		fields,
		spamScore: score,
		spamScoreVersion: CURRENT_SPAM_SCORE_VERSION,
		spamScoreComputedAt: new Date(),
	};
};

export const computeFullUserSpamVerdict = async (
	user: User,
): Promise<types.SpamVerdict<SpamTag> & { signals: string[] }> => {
	const report = await computeUserSpamReport(user);
	return {
		fields: report.fields,
		spamScore: report.score,
		spamScoreVersion: CURRENT_SPAM_SCORE_VERSION,
		spamScoreComputedAt: new Date(),
		signals: report.signals,
	};
};
