import { Op } from 'sequelize';
import mailgun from 'mailgun.js';
import dateFormat from 'dateformat';

import { asyncMap } from 'utils/async';
import { isProd } from 'utils/environment';
import { iterAllCommunities, getAllCommunityIds } from 'server/community/queries';
import { Member, User, Community } from 'server/models';
import { renderDigestEmail } from 'server/utils/email';
import * as types from 'types';

const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY!,
});

const memberQueryOptions = {
	include: [{ model: User, as: 'user' }],
	permissions: { [Op.or]: ['admin', 'manage'] },
	raw: true,
	nest: true,
};

// This script will generate ~100 digest emails concurrently, hopefully not
// spiking CPU or memory usage too hard.
async function main() {
	const now = new Date();
	const date = dateFormat(now.setDate(now.getDate() - now.getDay()), 'dd mmmm yyyy');
	// TODO: face your fears
	if (isProd()) return;

	// For each (sensibly-sized) chunk of communities
	for await (const communities of iterAllCommunities(20)) {
		const tasks = communities.map((community) => {
			// Load all community members who are subscribed to activity digest
			// emails
			const members: Promise<types.DefinitelyHas<types.Member, 'user'>[]> = Member.findAll({
				where: {
					communityId: community.id,
					receivesDigestEmail: true,
				},
				...memberQueryOptions,
			});
			// For each chunk of those users
			return asyncMap(
				members,
				async ({ user }) => {
					// Create an activity digest email
					const scope = { communityId: community.id };
					const digest = await renderDigestEmail(community, { scope, user });
					return mg.messages.create('mg.pubpub.org', {
						from: 'PubPub Team <hello@pubpub.org>',
						to: ['eric.g.mcdaniel@gmail.com'],
						subject: `${community.title} activity for the week of ${date}`,
						html: digest,
					});
				},
				{ concurrency: 5 },
			);
		});

		// Wait for this batch of emails to send.
		await Promise.all(tasks);
	}
}

main()
	.then(() => {
		console.info('Done sending activity digests!');
	})
	.catch((err) => {
		console.error('Failed to send activity digests!');
		console.error(err);
	})
	.finally(() => process.exit(0));
