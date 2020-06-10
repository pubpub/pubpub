import { User } from 'server/models';

import { BulkImportError } from '../errors';

export const expectParentCommunity = (directive, target, parents) => {
	if (!parents.community) {
		throw new BulkImportError(
			{ target: target, directive: directive },
			'Expected parent community directive',
		);
	}
};

export const getAttributionAttributes = async (attributionDirective) => {
	if (typeof attributionDirective === 'string') {
		return { name: attributionDirective, isAuthor: true };
	}
	const { slug, userId: rawUserId, ...restAttrs } = attributionDirective;
	let userId = null;
	if (rawUserId) {
		userId = rawUserId;
	} else if (slug) {
		const user = await User.findOne({ where: { slug: slug } });
		if (user) {
			userId = user.id;
		}
	}
	return { isAuthor: true, userId: userId, ...restAttrs };
};

export const cloneWithKeys = (object, keys) => {
	const res = {};
	Object.entries(object).forEach(([key, value]) => {
		if (keys.includes(key)) {
			res[key] = value;
		}
	});
	return res;
};
