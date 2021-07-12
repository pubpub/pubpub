import Bluebird from 'bluebird';

import { Collection, Community, Pub, PubAttribution, Member } from 'server/models';
import { setPubSearchData, deletePubSearchData } from 'server/utils/search';
import { createCollectionPub } from 'server/collectionPub/queries';
import { createDraft } from 'server/draft/queries';
import { slugifyString } from 'utils/strings';
import { generateHash } from 'utils/hashes';
import { getReadableDateInYear } from 'utils/dates';
import { createPubActivityItem, createPubUpdatedActivityItem } from 'server/activityItem/queries';
import { defer } from 'server/utils/deferred';

export const createPub = async (
	{
		communityId,
		collectionIds,
		slug,
		...restArgs
	}: { communityId: string; collectionIds?: string[]; slug?: string; [key: string]: any },
	userId: null | string = null,
) => {
	const newPubSlug = slug ? slug.toLowerCase().trim() : generateHash(8);
	const dateString = getReadableDateInYear(new Date());
	const { defaultPubCollections } = await Community.findOne({ where: { id: communityId } });
	const draft = await createDraft();

	const newPub = await Pub.create({
		title: `Untitled Pub on ${dateString}`,
		slug: newPubSlug,
		communityId,
		headerBackgroundColor: 'light',
		headerStyle: 'dark',
		viewHash: generateHash(8),
		editHash: generateHash(8),
		draftId: draft.id,
		...restArgs,
	});

	const createPubAttribution =
		userId &&
		PubAttribution.create({
			userId,
			pubId: newPub.id,
			isAuthor: true,
			order: 0.5,
		});

	const createMember =
		userId &&
		Member.create({
			userId,
			pubId: newPub.id,
			permissions: 'manage',
			isOwner: true,
		});

	const allCollectionIds = [...(defaultPubCollections || []), ...(collectionIds || [])];

	const createCollectionPubs = Bluebird.each(
		[...new Set(allCollectionIds)].filter((x) => x),
		async (collectionIdToAdd) => {
			// defaultPubCollections isn't constrained by the database in any way and might contain IDs
			// of collections that don't exist, so unfortunately we have to do an existence check here.
			const collection = await Collection.findOne({
				where: { id: collectionIdToAdd, communityId },
			});
			if (collection) {
				return createCollectionPub({
					collectionId: collectionIdToAdd,
					pubId: newPub.id,
				});
			}
			return null;
		},
	);

	await Promise.all([createPubAttribution, createCollectionPubs, createMember].filter((x) => x));
	setPubSearchData(newPub.id);
	defer(() => createPubActivityItem('pub-created', userId ?? null, newPub.id));
	return newPub;
};

export const updatePub = async (
	inputValues: Record<string, any>,
	updatePermissions: string[],
	userId: null | string = null,
) => {
	// Filter to only allow certain fields to be updated
	const filteredValues: any = {};
	Object.keys(inputValues).forEach((key) => {
		if (updatePermissions.includes(key)) {
			filteredValues[key] = inputValues[key];
		}
	});
	if (filteredValues.slug) {
		filteredValues.slug = slugifyString(filteredValues.slug);
	}
	const existingPub = await Pub.findOne({ where: { id: inputValues.pubId } });
	const previousPub = existingPub.toJSON();
	await existingPub.update(filteredValues);
	setPubSearchData(inputValues.pubId);
	defer(() => createPubUpdatedActivityItem(userId, previousPub.id, previousPub));
	return filteredValues;
};

export const destroyPub = async (pubId, userId: null | string = null) => {
	await createPubActivityItem('pub-removed', userId, pubId);
	return Pub.destroy({
		where: { id: pubId },
	}).then(() => {
		deletePubSearchData(pubId);
		return true;
	});
};
