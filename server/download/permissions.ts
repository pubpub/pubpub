import { getScope } from 'server/utils/queryHelpers';

export const getPermissions = async ({ userId, accessHash, communityId }) => {
	const {
		activePermissions: { canView },
	} = await getScope({
		communityId,
		loginId: userId,
		accessHash,
	});
	return { create: canView };
};
