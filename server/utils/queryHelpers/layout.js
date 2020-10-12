import { Op } from 'sequelize';

import { CollectionPub, Pub } from 'server/models';
import { issueCreatePubToken } from 'server/pub/tokens';

import buildPubOptions from './pubOptions';
import sanitizePub from './pubSanitize';

const getPubIdsForCollectionIds = async (collectionIds) => {
	if (collectionIds && collectionIds.length > 0) {
		const collectionPubs = await CollectionPub.findAll({
			where: {
				collectionId: {
					[Op.in]: collectionIds,
				},
			},
		});
		return collectionPubs.map((collectionPub) => collectionPub.pubId);
	}
	return null;
};

const getPubIdQueryForPinnedPubs = (pinnedPubIds, scopedPubIds) => {
	if (scopedPubIds) {
		return pinnedPubIds.filter((id) => scopedPubIds.includes(id));
	}
	return pinnedPubIds;
};

const getPubIdQueryForNonPinnedPubs = async (collectionIds, scopedPubIds) => {
	const matchingCollectionPubIds = await getPubIdsForCollectionIds(collectionIds);
	if (matchingCollectionPubIds) {
		const filteredPubIds = scopedPubIds
			? matchingCollectionPubIds.filter((id) => scopedPubIds.includes(id))
			: matchingCollectionPubIds;
		return {
			[Op.in]: filteredPubIds,
		};
	}
	if (scopedPubIds) {
		return {
			[Op.in]: scopedPubIds,
		};
	}
	return {};
};

const getPubsForLayoutBlock = async (blockContent, initialData, scopedPubIds) => {
	const {
		communityData: { id: communityId },
	} = initialData;
	const { limit, collectionIds, pubIds: pinnedPubIds } = blockContent;

	const sharedOptions = {
		...buildPubOptions({
			isPreview: true,
			getMembers: true,
			getCollections: true,
		}),
		...(limit && { limit: limit }),
		order: [['createdAt', 'DESC']],
	};

	const limitedPinnedPubIds = limit ? pinnedPubIds.slice(0, limit) : pinnedPubIds;
	const [pinnedPubs, otherPubs] = await Promise.all([
		Pub.findAll({
			where: {
				communityId: communityId,
				id: getPubIdQueryForPinnedPubs(limitedPinnedPubIds, scopedPubIds),
			},
			...sharedOptions,
		}),
		Pub.findAll({
			where: {
				communityId: communityId,
				id: {
					[Op.notIn]: limitedPinnedPubIds,
					...(await getPubIdQueryForNonPinnedPubs(collectionIds, scopedPubIds)),
				},
			},
			...sharedOptions,
		}),
	]);

	const sanitizedPubs = [...pinnedPubs, ...otherPubs]
		.map((pub) => sanitizePub(pub.toJSON(), initialData))
		.filter((pub) => !!pub);

	if (limit) {
		return sanitizedPubs.slice(0, limit);
	}
	return sanitizedPubs;
};

export const getPubsForLayout = async ({
	blocks,
	forLayoutEditor,
	initialData,
	scopedToCollectionId,
}) => {
	const scopedPubIds =
		scopedToCollectionId && (await getPubIdsForCollectionIds([scopedToCollectionId]));

	if (forLayoutEditor) {
		const collectionWhere = scopedPubIds && { id: { [Op.in]: scopedPubIds } };
		const pubs = await Pub.findAll({
			where: { communityId: initialData.communityData.id, ...collectionWhere },
			...buildPubOptions({ isPreview: true, getMembers: true, getCollections: true }),
		});
		return pubs.map((pub) => sanitizePub(pub.toJSON(), initialData)).filter((pub) => !!pub);
	}

	const pubsPerBlock = await Promise.all(
		blocks
			.filter((block) => block.type === 'pubs')
			.map((block) => getPubsForLayoutBlock(block.content, initialData, scopedPubIds)),
	);

	return pubsPerBlock.reduce(
		(acc, next) => [
			...acc,
			...next.filter((nextPub) => !acc.some((accPub) => accPub.id === nextPub.id)),
		],
		[],
	);
};

export const enrichLayoutWithPubTokens = (layoutBlocks, initialData) => {
	const { loginData, communityData } = initialData;
	const userId = loginData && loginData.id;
	if (layoutBlocks && userId) {
		return layoutBlocks.map((block) => {
			const { type, content } = block;
			if (type === 'banner') {
				const { buttonType, defaultCollectionIds } = content;
				if (buttonType === 'create-pub') {
					return {
						...block,
						content: {
							...content,
							createPubToken: issueCreatePubToken({
								userId: userId,
								communityId: communityData.id,
								createInCollectionIds: defaultCollectionIds,
							}),
						},
					};
				}
			}
			return block;
		});
	}
	return layoutBlocks;
};
