import { CollectionPub } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';

export const getPermissions = async ({ userId, communityId, collectionId }) => {
	if (!userId) {
		return {};
	}
	const scopeData = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	const isAuthenticated = scopeData.activePermissions.canManage;
	if (!scopeData.elements.activeCollection) {
		return {};
	}
	return {
		create: isAuthenticated,
		update: isAuthenticated ? ['rank', 'contextHint'] : false,
		setPrimary: isAuthenticated,
		destroy: isAuthenticated,
	};
};

export const canCreateCollectionPub = async ({ userId, communityId, collectionId }) => {
	const { activePermissions } = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	if (activePermissions.canManage) {
		return true;
	}
	return false;
};

export const getUpdatableFieldsForCollectionPub = async ({
	userId,
	communityId,
	collectionPubId,
}) => {
	const { collectionId } = await CollectionPub.findOne({ where: { id: collectionPubId } });
	const { activePermissions } = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	if (activePermissions.canManage) {
		return ['rank', 'pubRank', 'contextHint'];
	}
	return null;
};

export const canDestroyCollectionPub = async ({ userId, communityId, collectionPubId }) => {
	const { collectionId } = await CollectionPub.findOne({ where: { id: collectionPubId } });
	const { activePermissions } = await getScope({
		communityId: communityId,
		collectionId: collectionId,
		loginId: userId,
	});
	if (activePermissions.canManage) {
		return true;
	}
	return false;
};
