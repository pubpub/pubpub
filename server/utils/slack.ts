import type { UserSpamTagFields } from 'types';

import fetch from 'node-fetch';

import { isDangerousSpamScore } from 'server/spamTag/score';
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

export const postToSlackAboutNewCommunity = async (
	title: string,
	subdomain: string,
	adminName: string,
	adminEmail: string,
	spamScore: undefined | null | number,
) => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}
	const url = `https://${subdomain}.pubpub.org`;
	const spamDashUrl = `https://pubpub.org${getSuperAdminTabUrl('spam')}?q=${url}`;
	const spamScorePart = typeof spamScore === 'number' ? `\nSpam score: ${spamScore}` : '';
	await postToSlack({
		icon_emoji: ':bowtie:',
		attachments: [
			{
				fallback: `*${title}*\n<${url}>\n_${adminName} (${adminEmail})_`,
				pretext: 'New Community created!',
				color: 'good',
				fields: [
					{
						title: `${title}`,
						value: `${url}\n_${adminName} (${adminEmail})_${spamScorePart}`,
					},
				],
				actions: [
					{
						type: 'button',
						text: 'Manage in Spam Dashboard',
						style: spamScore && isDangerousSpamScore(spamScore) ? 'danger' : 'default',
						url: spamDashUrl,
					},
				],
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
	if (process.env.NODE_ENV === 'test') {
		return;
	}
	const spamUsersUrl = `https://pubpub.org${getSuperAdminTabUrl('spamUsers')}?q=${encodeURIComponent(userEmail)}`;
	await postToSlack({
		icon_emoji: ':warning:',
		attachments: [
			{
				fallback: `Suspicious upload by ${userName} (${userEmail}): ${key}`,
				pretext: 'Suspicious upload detected (scam keywords in filename)',
				color: 'warning',
				fields: [
					{ title: 'User', value: `${userName} (${userEmail})` },
					{ title: 'Object key', value: key },
				],
				actions: [
					{
						type: 'button',
						text: 'View in Spam Users Dashboard',
						url: spamUsersUrl,
					},
				],
			},
		],
	});
};

export const postToSlackAboutUserBan = async (
	userId: string,
	userEmail: string,
	userName: string,
	reason: UserSpamTagFields,
) => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}
	const spamUsersUrl = `https://pubpub.org${getSuperAdminTabUrl('spamUsers')}?q=${encodeURIComponent(userEmail)}`;
	let reasonText = '';
	if (reason.suspiciousFiles?.length) {
		reasonText = 'Uploading suspicious files';
	} else if (reason.suspiciousComments?.length) {
		reasonText = 'Posting suspicious comments';
	} else if (reason.honeypotTriggers?.length) {
		reasonText = 'Falling for honeypots';
	}
	await postToSlack({
		icon_emoji: ':warning:',
		attachments: [
			{
				fallback: `${userName} (${userEmail}) banned for ${reasonText}`,
				pretext: `${userName} (${userEmail}) banned for ${reasonText}`,
				color: 'danger',
				fields: [{ title: 'User', value: `${userName} (${userEmail})` }],
				actions: [
					{
						type: 'button',
						text: 'View in Spam Users Dashboard',
						url: spamUsersUrl,
					},
				],
			},
		],
	});
};

export const postToSlackAboutUserLifted = async (
	userId: string,
	userEmail: string,
	userName: string,
) => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}
	await postToSlack({
		icon_emoji: ':warning:',
		attachments: [
			{
				fallback: `${userName} (${userEmail}) lifted`,
				pretext: `${userName} (${userEmail}) lifted`,
				color: 'good',
				fields: [{ title: 'User', value: `${userName} (${userEmail})` }],
			},
		],
	});
};
