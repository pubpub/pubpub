import { Collection, Community } from 'server/models';
import { slugIsAvailable, findAcceptableSlug } from 'server/utils/slugs';
import { normalizeMetadataToKind } from 'utils/collections/metadata';
import { slugifyString } from 'utils/strings';
import { generateHash } from 'utils/hashes';
import { PubPubError } from 'server/utils/errors';
import { defer } from 'server/utils/deferred';
import {
	createCollectionActivityItem,
	createCollectionUpdatedActivityItem,
} from 'server/activityItem/queries';

export const generateDefaultCollectionLayout = () => {
	return {
		isNarrow: false,
		blocks: [
			{
				id: generateHash(8),
				type: 'collection-header',
				content: {},
			},
			{
				type: 'pubs',
				id: generateHash(8),
				content: {
					sort: 'collection-rank',
					pubPreviewType: 'medium',
				},
			},
		],
	};
};

export const createCollection = (
	{
		communityId,
		title,
		kind,
		pageId = null,
		doi = null,
		isPublic = false,
		isRestricted = true,
		id = null,
		slug = null,
	},
	userId: null | string = null,
) => {
	return Community.findOne({ where: { id: communityId } }).then(async (community) => {
		const normalizedTitle = title.trim();
		const collectionAttrs = {
			title: normalizedTitle,
			slug: await findAcceptableSlug(slug || slugifyString(title), communityId),
			isRestricted,
			isPublic,
			viewHash: generateHash(8),
			editHash: generateHash(8),
			communityId,
			pageId,
			doi,
			kind,
			layout: generateDefaultCollectionLayout(),
			// @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
			...(id && { id }),
		};
		const metadata = normalizeMetadataToKind({}, kind, {
			community,
			collection: collectionAttrs,
		});

		const collection = await Collection.create(
			{ ...collectionAttrs, metadata },
			{ returning: true },
		);

		defer(() => createCollectionActivityItem('collection-created', userId, collection.id));
		return collection;
	});
};

export const updateCollection = async (
	inputValues: Record<string, any>,
	updatePermissions: string[],
	userId: null | string = null,
) => {
	// Filter to only allow certain fields to be updated
	const filteredValues: Record<string, any> = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});

	if (filteredValues.slug) {
		filteredValues.slug = slugifyString(filteredValues.slug);
		const available = await slugIsAvailable({
			slug: filteredValues.slug,
			communityId: inputValues.communityId,
			activeElementId: inputValues.collectionId,
		});
		if (!available) {
			throw new PubPubError.InvalidFieldsError('slug');
		}
	}
	const existingCollection = await Collection.findOne({
		where: { id: inputValues.collectionId },
	});
	const previousCollection = existingCollection.toJSON();
	await existingCollection.update(filteredValues);
	defer(() =>
		createCollectionUpdatedActivityItem(userId, existingCollection.id, previousCollection),
	);
	return filteredValues;
};

export const destroyCollection = async (
	inputValues: { collectionId: string },
	userId: null | string = null,
) => {
	await createCollectionActivityItem('collection-removed', userId, inputValues.collectionId);
	return Collection.destroy({
		where: { id: inputValues.collectionId },
	});
};
