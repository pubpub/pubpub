import { Op } from 'sequelize';

import { Page, Collection } from 'server/models';
import { SlugStatus } from 'types';

export const definitelyForbiddenSlugs = [
	'dash',
	'redirects',
	'pubRedirects',
	'pubDocument',
	'pubDownloads',
	'collection',
	'dashboardActivity',
	'dashboardDiscussions',
	'dashboardEdges',
	'dashboardImpact',
	'dashboardMembers',
	'dashboardCommunityOverview',
	'dashboardCollectionOverview',
	'dashboardCustomScripts',
	'dashboardPubOverview',
	'dashboardPage',
	'dashboardPages',
	'dashboardReview',
	'dashboardReviews',
	'dashboardSettings',
	'dashboardCollectionLayout',
	'communityCreate',
	'explore',
	'about',
	'pricing',
	'adminDashboard',
	'landing',
	'login',
	'legal',
	'search',
	'signup',
	'passwordReset',
	'userCreate',
	'user',
	'page',
	'sitemap',
	'robots',
	'noMatch',
];

export const slugIsAvailable = async ({
	slug,
	communityId,
	activeElementId,
}): Promise<SlugStatus> => {
	if (definitelyForbiddenSlugs.includes(slug)) {
		return 'reserved';
	}
	const [pages, collections] = await Promise.all([
		Page.count({
			where: { communityId, slug, id: { [Op.not]: activeElementId } },
		}),
		Collection.count({
			where: { communityId, slug, id: { [Op.not]: activeElementId } },
		}),
	]);
	return pages === 0 && collections === 0 ? 'available' : 'used';
};

export const findAcceptableSlug = async (desiredSlug, communityId) => {
	// finds every slug for pages and collections, assuming this returns an array for both
	const [pages, collections] = await Promise.all([
		Page.findAll({
			attributes: ['slug'],
			where: { communityId, slug: desiredSlug },
		}),
		Collection.findAll({
			attributes: ['slug'],
			where: { communityId, slug: desiredSlug },
		}),
	]);
	console.log('what is returned?', pages, collections, '\n\n');
	// spreads array, then uses array map function
	const allSlugs = [...pages, ...collections].map((item) => item.slug);
	console.log('what are the slugs?', allSlugs, '\n\n');

	if (allSlugs.includes(desiredSlug)) {
		let suffix = 2;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const proposedSlug = `${desiredSlug}-${suffix}`;
			// perform another DB check for pages and collections with the slug
			// extend the allSlugs array with new arr
			if (!allSlugs.includes(proposedSlug)) {
				return proposedSlug;
			}
			suffix++;
		}
	}
	return desiredSlug;
};
