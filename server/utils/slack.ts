import type { SpamStatus, UserCommunityFlagReason, UserSpamTagFields } from 'types';

import fetch from 'node-fetch';

import { isDangerousSpamScore } from 'server/spamTag/communityScore';
import { isProd } from 'utils/environment';
import { getSuperAdminTabUrl } from 'utils/superAdmin';

const defaultBody = { username: 'PubPub', unfurl_links: true };

export const postToSlack = async (body: Record<string, any>) => {
	const slackUrl = process.env.SLACK_WEBHOOK_URL!;
	if (slackUrl) {
		try {
			const res = await fetch(slackUrl, {
				method: 'POST',
				body: JSON.stringify({ ...defaultBody, ...body }),
			});
			if (res.status < 200 || res.status > 299) {
				const bodyText = await res.text();
				throw new Error(`Got response ${res.status} ${bodyText}`);
			}
		} catch (err) {
			console.error('Failed to post to Slack.', err);
		}
	}
};

type NewCommunitySlackOptions = {
	title: string;
	subdomain: string;
	adminName: string;
	adminEmail: string;
	spamScore: undefined | null | number;
	description?: string | null;
	heroLogo?: string | null;
	accentColorDark?: string | null;
};

const buildNewCommunityBlocks = (
	opts: NewCommunitySlackOptions & { url: string; spamDashUrl: string },
) => {
	const { title, url, adminName, adminEmail, spamScore, description, heroLogo, spamDashUrl } =
		opts;
	const isDangerous = typeof spamScore === 'number' && isDangerousSpamScore(spamScore);

	const blocks: Record<string, any>[] = [];

	const headerSection: Record<string, any> = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `*<${url}|${title}>*\n${url}`,
		},
	};
	if (heroLogo) {
		headerSection.accessory = {
			type: 'image',
			image_url: heroLogo,
			alt_text: title,
		};
	}
	blocks.push(headerSection);

	if (description) {
		blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `> ${description}`,
			},
		});
	}

	const spamScorePart = typeof spamScore === 'number' ? `  |  Spam score: *${spamScore}*` : '';

	blocks.push({
		type: 'context',
		elements: [
			{
				type: 'mrkdwn',
				text: `Created by *${adminName}* (${adminEmail})${spamScorePart}`,
			},
		],
	});

	blocks.push({
		type: 'actions',
		elements: [
			{
				type: 'button',
				text: {
					type: 'plain_text',
					text: isDangerous ? 'Review Community' : 'Approve Community',
				},
				url: spamDashUrl,
				...(isDangerous ? { style: 'danger' } : {}),
			},
			{
				type: 'button',
				text: { type: 'plain_text', text: 'Visit Community' },
				url,
			},
		],
	});

	return blocks;
};

type CommunityStatusSlackOptions = {
	title: string;
	subdomain: string;
	status: SpamStatus;
};

export const postToSlackAboutCommunityStatusChange = async (opts: CommunityStatusSlackOptions) => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}

	const { title, subdomain, status } = opts;
	const baseUrl = isProd() ? 'pubpub.org' : 'duqduq.org';
	const url = `https://${subdomain}.${baseUrl}`;
	const spamDashUrl = `https://${baseUrl}${getSuperAdminTabUrl('spam')}?q=${subdomain}`;

	const emoji = status === 'confirmed-not-spam' ? ':white_check_mark:' : ':no_entry:';
	const verb = status === 'confirmed-not-spam' ? 'approved' : 'rejected';
	const color = status === 'confirmed-not-spam' ? '#5cb85c' : '#d9534f';
	const notificationText = `Community ${verb}: ${title}`;

	await postToSlack({
		icon_emoji: emoji,
		text: notificationText,
		attachments: [
			{
				color,
				fallback: notificationText,
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: `*<${url}|${title}>* has been *${verb}*`,
						},
					},
					{
						type: 'actions',
						elements: [
							{
								type: 'button',
								text: { type: 'plain_text', text: 'Spam Dashboard' },
								url: spamDashUrl,
							},
							{
								type: 'button',
								text: { type: 'plain_text', text: 'Visit Community' },
								url,
							},
						],
					},
				],
			},
		],
	});
};

export const postToSlackAboutNewCommunity = async (opts: NewCommunitySlackOptions) => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}

	const { title, subdomain, adminName, adminEmail, spamScore, accentColorDark } = opts;
	const baseUrl = isProd() ? 'pubpub.org' : 'duqduq.org';
	const url = `https://${subdomain}.${baseUrl}`;
	const spamDashUrl = `https://${baseUrl}${getSuperAdminTabUrl('spam')}?q=${subdomain}`;
	const isDangerous = typeof spamScore === 'number' && isDangerousSpamScore(spamScore);

	const envSuffix = isProd() ? '' : ' _(dev, ignore)_';
	const notificationText = `New Community: ${title} by ${adminName} (${adminEmail})${envSuffix}`;

	const sidebarColor = isDangerous ? '#d9534f' : accentColorDark || '#2D2E2F';

	await postToSlack({
		icon_emoji: ':bowtie:',
		text: notificationText,
		attachments: [
			{
				color: sidebarColor,
				fallback: notificationText,
				blocks: buildNewCommunityBlocks({ ...opts, url, spamDashUrl }),
			},
		],
	});
};

export const postToSlackAboutSuspiciousUpload = async (
	userId: string,
	userEmail: string,
	userName: string,
	key: string,
) => {
	if (process.env.NODE_ENV === 'test') return;
	const dashUrl = getSpamDashUrl(userName);
	await postToSlack({
		icon_emoji: ':warning:',
		attachments: [
			{
				fallback: `Suspicious upload by ${userName}: ${key}`,
				pretext: 'Suspicious upload detected (scam keywords in filename)',
				color: 'warning',
				fields: [
					{ title: 'User', value: userName },
					{ title: 'Object key', value: key },
				],
				actions: [
					{
						type: 'button',
						text: 'View in Spam Users Dashboard',
						url: dashUrl,
					},
				],
			},
		],
	});
};

const getUserProfileUrl = (userSlug: string) => `https://www.pubpub.org/user/${userSlug}`;

const getSpamDashUrl = (userName: string) =>
	`https://pubpub.org${getSuperAdminTabUrl('spamUsers')}?q=${encodeURIComponent(userName)}`;

const buildReasonText = (reason?: UserSpamTagFields): string => {
	if (!reason) return '';
	if (reason.manuallyMarkedBy?.length) {
		const last = reason.manuallyMarkedBy[reason.manuallyMarkedBy.length - 1];
		return `Manually marked by ${last.userName}`;
	}
	if (reason.suspiciousFiles?.length) return 'Uploading suspicious files';
	if (reason.suspiciousComments?.length) return 'Posting suspicious comments';
	if (reason.honeypotTriggers?.length) {
		const last = reason.honeypotTriggers[reason.honeypotTriggers.length - 1];
		const parts: string[] = [last.honeypot];
		if (last.context?.communitySubdomain)
			parts.push(`community: ${last.context.communitySubdomain}`);
		if (last.context?.pubSlug) parts.push(`pub: ${last.context.pubSlug}`);
		return `Honeypot triggered (${parts.join(', ')})`;
	}
	return '';
};

const buildHoneypotContextLine = (reason?: UserSpamTagFields): string | null => {
	if (!reason?.honeypotTriggers?.length) return null;
	const last = reason.honeypotTriggers[reason.honeypotTriggers.length - 1];
	if (!last.context) return null;
	const parts: string[] = [];
	if (last.context.communitySubdomain) {
		const communityUrl = `https://${last.context.communitySubdomain}.pubpub.org`;
		parts.push(`Community: <${communityUrl}|${last.context.communitySubdomain}>`);
	}
	if (last.context.pubSlug && last.context.communitySubdomain) {
		const pubUrl = `https://${last.context.communitySubdomain}.pubpub.org/pub/${last.context.pubSlug}`;
		parts.push(`Pub: <${pubUrl}|${last.context.pubSlug}>`);
	} else if (last.context.pubSlug) {
		parts.push(`Pub: ${last.context.pubSlug}`);
	}
	if (last.context.content) {
		const truncated =
			last.context.content.length > 200
				? last.context.content.slice(0, 200) + '...'
				: last.context.content;
		parts.push(`Content: ${truncated}`);
	}
	return parts.length > 0 ? parts.join('  |  ') : null;
};

type UserBanSlackOptions = {
	userId: string;
	userName: string;
	userSlug: string;
	userAvatar?: string | null;
	reason?: UserSpamTagFields;
	actorName?: string;
};

export const postToSlackAboutUserBan = async (opts: UserBanSlackOptions) => {
	if (process.env.NODE_ENV === 'test') return;
	const { userName, userSlug, userAvatar, reason, actorName } = opts;
	const profileUrl = getUserProfileUrl(userSlug);
	const dashUrl = getSpamDashUrl(userName);
	const reasonText = buildReasonText(reason);
	const byText = actorName ? ` by ${actorName}` : '';
	const reasonSuffix = reasonText ? ` -- ${reasonText}` : '';
	const headline = `*<${profileUrl}|${userName}>* banned${byText}${reasonSuffix}`;
	const fallback = `${userName} banned${byText}${reasonSuffix}`;

	const headerSection: Record<string, any> = {
		type: 'section',
		text: { type: 'mrkdwn', text: headline },
	};
	if (userAvatar) {
		headerSection.accessory = {
			type: 'image',
			image_url: userAvatar,
			alt_text: userName,
		};
	}

	const blocks: Record<string, any>[] = [headerSection];

	const honeypotLine = buildHoneypotContextLine(reason);
	if (honeypotLine) {
		blocks.push({
			type: 'context',
			elements: [{ type: 'mrkdwn', text: honeypotLine }],
		});
	}

	blocks.push({
		type: 'actions',
		elements: [
			{ type: 'button', text: { type: 'plain_text', text: 'Profile' }, url: profileUrl },
			{ type: 'button', text: { type: 'plain_text', text: 'Spam Dashboard' }, url: dashUrl },
		],
	});

	await postToSlack({
		icon_emoji: ':no_entry:',
		text: fallback,
		attachments: [{ fallback, color: 'danger', blocks }],
	});
};

type UserLiftedSlackOptions = {
	userId: string;
	userName: string;
	userSlug: string;
	actorName?: string;
};

export const postToSlackAboutUserLifted = async (opts: UserLiftedSlackOptions) => {
	if (process.env.NODE_ENV === 'test') return;
	const { userName, userSlug, actorName } = opts;
	const profileUrl = getUserProfileUrl(userSlug);
	const byText = actorName ? ` by ${actorName}` : '';
	const headline = `*<${profileUrl}|${userName}>* restriction lifted${byText}`;
	const fallback = `${userName} restriction lifted${byText}`;
	await postToSlack({
		icon_emoji: ':white_check_mark:',
		text: fallback,
		attachments: [
			{
				fallback,
				color: '#5cb85c',
				blocks: [
					{ type: 'section', text: { type: 'mrkdwn', text: headline } },
					{
						type: 'actions',
						elements: [
							{
								type: 'button',
								text: { type: 'plain_text', text: 'Profile' },
								url: profileUrl,
							},
						],
					},
				],
			},
		],
	});
};

type NewSpamTagSlackOptions = {
	userId: string;
	userName: string;
	userSlug: string;
	spamScore: number | null;
};

export const postToSlackAboutNewUserSpamTag = async (opts: NewSpamTagSlackOptions) => {
	if (process.env.NODE_ENV === 'test') return;
	const { userName, userSlug, spamScore } = opts;
	const profileUrl = getUserProfileUrl(userSlug);
	const dashUrl = getSpamDashUrl(userName);
	const scorePart = spamScore != null ? ` (score: ${spamScore})` : '';
	const headline = `New spam tag for *<${profileUrl}|${userName}>*${scorePart}`;
	const fallback = `New spam tag: ${userName}${scorePart}`;
	await postToSlack({
		icon_emoji: ':mag:',
		text: fallback,
		attachments: [
			{
				fallback,
				color: '#f0ad4e',
				blocks: [
					{ type: 'section', text: { type: 'mrkdwn', text: headline } },
					{
						type: 'actions',
						elements: [
							{
								type: 'button',
								text: { type: 'plain_text', text: 'Profile' },
								url: profileUrl,
							},
							{
								type: 'button',
								text: { type: 'plain_text', text: 'Review in Dashboard' },
								url: dashUrl,
							},
						],
					},
				],
			},
		],
	});
};

type CommunityFlagSlackOptions = {
	flagId: string;
	userId: string;
	flaggedById: string;
	communityId: string;
	reason: UserCommunityFlagReason;
	reasonText?: string | null;
	sourceDiscussionId?: string | null;
};

export const postToSlackAboutCommunityFlag = async (opts: CommunityFlagSlackOptions) => {
	if (process.env.NODE_ENV === 'test') return;
	const { User, Community, Discussion, Pub } = await import('server/models');
	const [user, flagger, community, discussion] = await Promise.all([
		User.findByPk(opts.userId, { attributes: ['fullName', 'slug'] }),
		User.findByPk(opts.flaggedById, { attributes: ['fullName', 'slug'] }),
		Community.findByPk(opts.communityId, { attributes: ['subdomain'] }),
		opts.sourceDiscussionId
			? Discussion.findByPk(opts.sourceDiscussionId, {
					attributes: ['id', 'title', 'pubId'],
					include: [{ model: Pub, as: 'pub', attributes: ['slug'] }],
				})
			: null,
	]);
	const userName = user?.fullName ?? 'Unknown user';
	const userSlug = user?.slug ?? '';
	const flaggerName = flagger?.fullName ?? 'Unknown admin';
	const subdomain = community?.subdomain ?? 'unknown';
	const profileUrl = getUserProfileUrl(userSlug);
	const dashUrl = getSpamDashUrl(userName);

	const reasonLabel = opts.reason.replace(/-/g, ' ');
	const extraReason = opts.reasonText ? `: ${opts.reasonText}` : '';
	let discussionLink = '';
	if (discussion) {
		const pub = (discussion as any).pub;
		if (pub?.slug) {
			discussionLink = `\nDiscussion: https://${subdomain}.pubpub.org/pub/${pub.slug}`;
		}
	}

	const headline =
		`*<${profileUrl}|${userName}>* flagged by ${flaggerName} in *${subdomain}*` +
		`\nReason: ${reasonLabel}${extraReason}${discussionLink}`;
	const fallback = `${userName} flagged by ${flaggerName} in ${subdomain} for ${reasonLabel}`;

	await postToSlack({
		icon_emoji: ':triangular_flag_on_post:',
		text: fallback,
		attachments: [
			{
				fallback,
				color: '#e67e22',
				blocks: [
					{ type: 'section', text: { type: 'mrkdwn', text: headline } },
					{
						type: 'actions',
						elements: [
							{
								type: 'button',
								text: { type: 'plain_text', text: 'User Profile' },
								url: profileUrl,
							},
							{
								type: 'button',
								text: { type: 'plain_text', text: 'Spam Dashboard' },
								url: dashUrl,
							},
						],
					},
				],
			},
		],
	});
};
