import { getScope } from 'server/utils/queryHelpers';

export const canManageSubmissionWorkflow = async ({ userId, collectionId, communityId }) => {
	const {
		activePermissions: { canManage },
	} = await getScope({ collectionId, communityId, loginId: userId });
	return canManage;
};
