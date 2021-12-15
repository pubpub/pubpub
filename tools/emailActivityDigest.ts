import { Op } from 'sequelize';

import { asyncMap } from 'utils/async';
import { isProd } from 'utils/environment';
import { iterAllCommunities } from 'server/community/queries';
import { Member, User, Community } from 'server/models';
import { renderDigestEmail } from 'server/utils/email';
import * as types from 'types';
import mailgun from 'server/utils/email/mailgun';

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

async function main() {
	// TODO: face your fears
	if (isProd()) return;

	// For each (sensibly-sized) chunk of communities
	for await (const communities of iterAllCommunities(10)) {
		const tasks = communities.map((community) => {
			// Load all community members who are subscribed to activity digest
			// emails
			const members: Promise<types.DefinitelyHas<types.Member, 'user'>[]> = Member.findAll({
				where: {
					communityId: community.id,
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
					console.log(digest.length);
				},
				{ concurrency: 5 },
			);
		});

		await Promise.all(tasks);
	}
}

main();
