import { Collection, Community } from 'server/models';
import { slugIsAvailable, findAcceptableSlug } from 'server/utils/slugs';
import { normalizeMetadataToKind } from 'utils/collections/metadata';
import { slugifyString } from 'utils/strings';
import { generateHash } from 'utils/hashes';
import { PubPubError } from 'server/utils/errors';
import * as types from 'types';
import pick from 'lodash.pick';

import { editableFields } from './permissions';

type CollectionCreationData = Partial<types.Collection> &
	Pick<types.Collection, 'title' | 'communityId' | 'kind'>;

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

export const createCollection = async (
	creationValues: CollectionCreationData,
	actorId?: string,
) => {
	const {
		communityId,
		title,
		kind,
		pageId = null,
		doi = null,
		isPublic = false,
		isRestricted = true,
		id = null,
		slug = null,
	} = creationValues;
	if (title) {
		const slugStatus = await slugIsAvailable({
			slug: slug || slugifyString(title),
			communityId,
			activeElementId: id,
		});

		if (slugStatus === 'reserved') {
			throw new PubPubError.ForbiddenSlugError(slugStatus);
		}
	}
	return Community.findOne({ where: { id: communityId } }).then(async (community) => {
		const normalizedTitle = title.trim();
		const collection = {
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
			...(id && { id }),
		};
		const metadata = normalizeMetadataToKind({}, kind, {
			community,
			collection,
		});
		return Collection.create({ ...collection, metadata }, { returning: true, actorId });
	});
};

const verifySlug = async (patch: Partial<types.Collection>) => {
	if (!patch.slug) return patch;
	const slug = slugifyString(patch.slug);
	const slugStatus = await slugIsAvailable({
		slug,
		communityId: patch.communityId,
		activeElementId: patch.id,
	});
	if (slugStatus !== 'available') {
		throw new PubPubError.ForbiddenSlugError(slugStatus);
	}
	return { ...patch, slug };
};

export const updateCollection = async (patch: Partial<types.Collection>, actorId?: string) => {
	const withVerifiedSlug = await verifySlug(patch);
	const filteredValues = pick(withVerifiedSlug, editableFields);
	await Collection.update(filteredValues, {
		where: { id: patch.id },
		individualHooks: true,
		actorId,
	});
	return filteredValues;
};

export const destroyCollection = (patch: Partial<types.Collection>, actorId?: string) =>
	Collection.destroy({
		where: { id: patch.id },
		individualHooks: true,
		actorId,
	});
