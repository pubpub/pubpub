import { getScope } from 'server/utils/queryHelpers';

export const getPermissions = async ({ userId, communityId, collectionId }) => {
	if (!userId) {
		return {};
	}
	const scopeData = await getScope({
		communityId,
		collectionId,
		loginId: userId,
	});

	const isAuthenticated = scopeData.activePermissions.canManage;
	if (!isAuthenticated) {
		return { create: isAuthenticated };
	}
	const editProps = [`enabled`, `instructions`, `afterSubmittedText`, `email`, `layoutBlock`];

	return {
		create: isAuthenticated,
		update: isAuthenticated ? editProps : (false as const),
		destroy: isAuthenticated,
	};
};

export const canManageSubmissionWorkflow = async ({ userId, collectionId, communityId }) => {
	const {
		activePermissions: { canManage },
	} = await getScope({ collectionId, communityId, loginId: userId });
	return canManage;
};
