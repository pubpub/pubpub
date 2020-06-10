import uuid from 'uuid';

import { Community } from 'server/models';

import { BulkImportError } from '../errors';

const findOrCreateCommunity = (directive) => {
	if (directive.create) {
		const unique = uuid.v4();
		return Community.create({
			title: directive.title || 'Community ' + unique,
			subdomain: directive.subdomain || unique,
			navigation: [],
		});
	}
	const foundCommunity = Community.findOne({ where: { slug: directive.slug } });
	if (!foundCommunity) {
		throw new BulkImportError(
			{ directive: directive },
			`No existing Community with slug ${directive.slug}. If you meant to create one, use "create: true"`,
		);
	}
	return foundCommunity;
};

export const resolveCommunityDirective = (directive, target) => {
	const community = findOrCreateCommunity(directive);
	return { community: community, target: target };
};
