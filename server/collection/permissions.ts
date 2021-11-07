import { getScope } from 'server/utils/queryHelpers';

export const editableFields = [
	'title',
	'slug',
	'isRestricted',
	'isPublic',
	'pageId',
	'metadata',
	'readNextPreviewSize',
	'layout',
	'avatar',
];

type Permissions = {
	canCreate?: boolean;
	canDestroy?: boolean;
	canUpdate?: boolean;
};

export const getPermissions = async ({
	userId,
	communityId,
	collectionId,
}): Promise<Permissions> => {
	if (!userId) {
		return {};
	}
	const {
		activePermissions: { canManage },
		elements: { activeCollection },
	} = await getScope({
		communityId,
		collectionId,
		loginId: userId,
	});
	return activeCollection
		? {
				canCreate: canManage,
				canUpdate: canManage,
				canDestroy: canManage,
		  }
		: { canCreate: canManage };
};
