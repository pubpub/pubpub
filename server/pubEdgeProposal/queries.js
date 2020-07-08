import { Op } from 'sequelize';

import { Community, Pub, PubAttribution } from 'server/models';

export const getPubSlug = async (url) => {
	return url.match(/\/pub\/(.*)\//);
};

export const getPubDataFromUrl = async (url) => {
	const { hostname, pathname } = url;
	const matches = pathname.match(/^\/pub\/(\w+)/);

	if (!matches) {
		return null;
	}

	const communityName = hostname.split('.')[0];
	const slug = matches[1];

	const community = await Community.findOne({
		where: {
			[Op.or]: [{ domain: hostname }, { subdomain: communityName }],
		},
	});

	if (!community) {
		return null;
	}

	const pub = await Pub.findOne({
		where: {
			communityId: community.id,
			slug: slug,
		},
		include: {
			model: PubAttribution,
			as: 'attributions',
			separate: true,
		},
	});

	return pub || null;
};
