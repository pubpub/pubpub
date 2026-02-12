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
	// if (isProd()) {
	if (process.env.NODE_ENV === 'test') {
		return;
	}

	const message = isProd()
		? `New Community created!`
		: `New Community created! (in development, ignore)`;

	const baseUrl = isProd() ? 'pubpub.org' : 'duqduq.org';

	const url = `https://${subdomain}.${baseUrl}`;
	const spamDashUrl = `https://${baseUrl}${getSuperAdminTabUrl('spam')}?q=${subdomain}`;
	const spamScorePart = typeof spamScore === 'number' ? `\nSpam score: ${spamScore}` : '';
	await postToSlack({
		icon_emoji: ':bowtie:',
		attachments: [
			{
				fallback: `*${title}*\n<${url}>\n_${adminName} (${adminEmail})_`,
				pretext: message,
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
						text:
							spamScore && isDangerousSpamScore(spamScore)
								? 'See Community'
								: 'Approve Community',
						style: spamScore && isDangerousSpamScore(spamScore) ? 'danger' : 'default',
						url: spamDashUrl,
					},
				],
			},
		],
	});
	// }
};
