import { createCollection } from 'server/collection/queries';
import { Collection, CollectionPub, CollectionAttribution } from 'server/models';
import findRank from 'shared/utils/findRank';

import { BulkImportError } from '../errors';
import { expectParentCommunity, getAttributionAttributes } from './util';

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

const findOrCreateCollection = async (directive, community, target, markCreated) => {
	if (directive.create) {
		const { title: directiveTitle, kind } = directive;
		const title = directiveTitle || target.name;
		const collection = await createCollection({
			communityId: community.id,
			title: title,
			kind: kind,
		});
		return markCreated(collection);
	}
	const foundCollection = await Collection.findOne({ where: { slug: directive.slug } });
	if (!foundCollection) {
		throw new BulkImportError(
			{ directive: directive },
			`No existing Collection with slug ${directive.slug}. If you meant to create one, use "create: true"`,
		);
	}
};

const expectAllChildrenArePubs = (children, directive, target) => {
	if (!children.every((child) => child.pub)) {
		throw new BulkImportError(
			{ directive: directive, target: target },
			'All children of a Collection must be Pubs',
		);
	}
};

const getChildPubSortIndex = (child, order) => {
	const { pub, target } = child;
	return order.findIndex(
		(entry) => pub.slug === entry || pub.title === entry || entry === target.path,
	);
};

const maybeSortChildren = (children, order) => {
	if (!order) {
		return children;
	}
	return children.sort((first, second) => {
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

const prepareRanksForNewChildren = async (collection, numberOfNewChildren) => {
	const existingChildren = await CollectionPub.findAll({
		where: { collectionId: collection.id },
	});
	return findRank(
		existingChildren.map((child) => child.rank),
		existingChildren.length,
		numberOfNewChildren,
	);
};

const createCollectionPubs = (collection, children, ranks) =>
	Promise.all(
		children.map((child, index) =>
			CollectionPub.create({
				collectionId: collection.id,
				pubId: child.pub.id,
				rank: ranks[index],
				isPrimary: true,
			}),
		),
	);

export const resolveCollectionDirective = async (directive, target, context) => {
	const { parents, markCreated, resolveChildren } = context;
	expectParentCommunity(directive, target);
	if (parents.collection) {
		throw new BulkImportError(
			{ directive: directive, target: target },
			`Cannot created nested collection inside ${parents.collection}`,
		);
	}
	const collection = await findOrCreateCollection(directive, parents.community, markCreated);
	await createCollectionAttributions(collection, directive);
	const unsortedChildren = await resolveChildren();
	expectAllChildrenArePubs(unsortedChildren);
	const children = maybeSortChildren(unsortedChildren, directive.order);
	const ranks = await prepareRanksForNewChildren(collection, children.length);
	await createCollectionPubs(children, ranks);
	return { collection: collection, target: target };
};
