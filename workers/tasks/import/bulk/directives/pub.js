import { createPub as createPubQuery } from 'server/pub/queries';
import { PubAttribution } from 'server/models';

import { BulkImportError } from '../errors';
import { getAttributionAttributes, cloneWithKeys } from './util';

const pubAttributesFromDirective = ['title', 'description'];

const getSourcesForMetadataStrategy = (directive) => {
	const { metadataStrategy: strategy } = directive;
	if (!strategy || strategy === 'merge') {
		return { import: true, directive: true };
	}
	if (strategy === 'import') {
		return { import: true };
	}
	if (strategy === 'directive') {
		return { directive: true };
	}
	throw new BulkImportError(
		{ directive: directive },
		`Invalid metadataStrategy ${strategy}. Must be one of "merge", "import", "directive"`,
	);
};

const createPubAttributions = async (pub, proposedMetadata, directive) => {
	const { attributions: proposedAttributions = [] } = proposedMetadata;
	const { matchSlugsToAttributions = [] } = directive;
	const sources = getSourcesForMetadataStrategy(directive);
	let attributionsAttrs = [];
	if (sources.import) {
		const matchedProposedAttributions = proposedAttributions.map(({ name, users }) => {
			const matchedUser = users.find((user) => matchSlugsToAttributions.includes(user.slug));
			const userId = matchedUser && matchedUser.id;
			return { name: name, userId: userId };
		});
		attributionsAttrs = [...attributionsAttrs, matchedProposedAttributions];
	}
	if (sources.directive && Array.isArray(directive.attributions)) {
		attributionsAttrs = [...attributionsAttrs, ...directive.attributions];
	}
	await Promise.all(attributionsAttrs).then((res) =>
		res.map((attrDirective, index, { length }) =>
			PubAttribution.create({
				pubId: pub.id,
				order: 1 / 2 ** (length - index),
				...getAttributionAttributes(attrDirective),
			}),
		),
	);
};

const createPub = (communityId, directive, proposedMetadata, actor) => {
	const sources = getSourcesForMetadataStrategy(directive);
	const attributes = {
		communityId: communityId,
		...(sources.import && cloneWithKeys(proposedMetadata, ['title', 'description'])),
		...(sources.directive && cloneWithKeys(directive, pubAttributesFromDirective)),
	};
	return createPubQuery(attributes, actor.id);
};

export const resolvePubDirective = async ({ directive, targetPath, community, actor }) => {
	const proposedMetadata = {};
	const pub = await createPub(community.id, proposedMetadata, directive, actor);
	await createPubAttributions(pub, proposedMetadata, directive);
	return {
		pub: pub,
		created: true,
	};
};
