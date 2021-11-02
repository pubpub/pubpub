import { Submission } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';

export const getPermissions = async ({ userId, communityId, submissionId, collectionId }) => {
	if (!userId) {
		return {};
	}
	const scopeData = await getScope({
		communityId,
		collectionId,
		loginId: userId,
	});
	const isAuthenticated = scopeData.activePermissions.canManage;
	const submissionData = await Submission.findOne({ where: { id: submissionId } });

	if (!submissionData) {
		return { create: isAuthenticated };
	}
	const editProps = ['status'];
	return {
		create: isAuthenticated,
		update: isAuthenticated && editProps,
		destroy: isAuthenticated,
	};
};
