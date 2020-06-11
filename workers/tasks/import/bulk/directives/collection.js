import { createCollection } from 'server/collection/queries';
import { Collection, CollectionPub, CollectionAttribution } from 'server/models';
import findRank from 'shared/utils/findRank';

import { BulkImportError } from '../errors';
import { getAttributionAttributes } from './util';

const createCollectionAttributions = async (collection, directive) => {
	const { attributions } = directive;
	if (!attributions) {
		return;
	}
	await Promise.all(
		attributions.map((attrDirective, index, { length }) =>
			CollectionAttribution.create({
				collectionId: collection.id,
				order: 1 / 2 ** (length - index),
				...getAttributionAttributes(attrDirective),
			}),
		),
	);
};

const findOrCreateCollection = async (directive, community) => {
	if (directive.create) {
		const title = directive.title || directive.$meta.name;
		const collection = await createCollection({
			communityId: community.id,
			title: title,
			kind: directive.kind || 'tag',
		});
		return collection;
	}
	const foundCollection = await Collection.findOne({ where: { slug: directive.slug } });
	if (!foundCollection) {
		throw new BulkImportError(
			{ directive: directive },
			`No existing Collection with slug ${directive.slug}. If you meant to create one, use "create: true"`,
		);
	}
	return foundCollection;
};

const extractPubsFromResolvedChildren = (resolvedChildren, directive, path) => {
	return resolvedChildren.map((child) => {
		if (child.pub) {
			return child.pub;
		}
		throw new BulkImportError(
			{ directive: directive, path: path },
			'All children of a Collection must be Pubs',
		);
	});
};

const getChildPubSortIndex = (pub, path, order) => {
	return order.findIndex((entry) => pub.slug === entry || pub.title === entry || entry === path);
};

const maybeSortChildPubs = (pubs, order) => {
	if (!order) {
		return pubs;
	}
	return pubs.sort((first, second) => {
		const indexOfFirst = getChildPubSortIndex(first, order);
		const indexOfSecond = getChildPubSortIndex(second, order);
		if (indexOfFirst === -1 && indexOfSecond === -1) {
			return 0;
		}
		if (indexOfFirst === -1) {
			return 1;
		}
		if (indexOfSecond === -1) {
			return -1;
		}
		return indexOfFirst - indexOfSecond;
	});
};

const prepareRanksForNewPubs = async (collection, numberOfNewChildren) => {
	const existingChildren = await CollectionPub.findAll({
		where: { collectionId: collection.id },
	});
	return findRank(
		existingChildren.map((child) => child.rank),
		existingChildren.length,
		numberOfNewChildren,
	);
};

const createCollectionPubs = (collection, pubs, ranks) =>
	Promise.all(
		pubs.map((pub, index) =>
			CollectionPub.create({
				collectionId: collection.id,
				pubId: pub.id,
				rank: ranks[index],
				isPrimary: true,
			}),
		),
	);

export const resolveCollectionDirective = async ({ directive, community }) => {
	const collection = await findOrCreateCollection(directive, community);
	await createCollectionAttributions(collection, directive);

	const handleResolvedChildren = async (resolvedChildren) => {
		const unsortedPubs = extractPubsFromResolvedChildren(resolvedChildren);
		const pubs = maybeSortChildPubs(unsortedPubs, directive.order);
		const ranks = await prepareRanksForNewPubs(collection, pubs.length);
		await createCollectionPubs(collection, pubs, ranks);
	};

	return {
		collection: collection,
		created: directive.create,
		onResolvedChildren: handleResolvedChildren,
	};
};
