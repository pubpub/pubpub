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
	if (!scopeData.elements.activeCollection) {
		return { create: isAuthenticated };
	}
	const editProps = [
		`collectionId`,
		`enabled`,
		`instructions`,
		`afterSubmittedText`,
		`emailText`,
		`layoutBlock`,
		`targetEmailAddress`,
	];
	return {
		create: isAuthenticated,
		update: isAuthenticated ? editProps : (false as const),
		destroy: isAuthenticated,
	};
};
