import { createPub as createPubQuery } from 'server/pub/queries';
import { Pub, PubAttribution } from 'server/models';

import { BulkImportError } from '../errors';
import { expectParentCommunity, getAttributionAttributes, cloneWithKeys } from './util';

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
	await Promise.all(attributionsAttrs).map((attrDirective, index, { length }) =>
		PubAttribution.create({
			pubId: pub.id,
			order: 1 / 2 ** (length - index),
			...getAttributionAttributes(attrDirective),
		}),
	);
};

const createPub = (directive, proposedMetadata, actor) => {
	const sources = getSourcesForMetadataStrategy(directive);
	const attributes = {
		...(sources.import && cloneWithKeys(proposedMetadata, ['title', 'description'])),
		...(sources.directive && cloneWithKeys(directive, pubAttributesFromDirective)),
	};
	return createPubQuery(attributes, actor);
};

export const resolvePubDirective = async (directive, target, context) => {
	const { parents } = context;
	const proposedMetadata = {};
	expectParentCommunity(directive, target, parents);
	await createPub(directive, proposedMetadata, context.actor);
};
