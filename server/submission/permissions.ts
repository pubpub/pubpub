import { Submission } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';
import { initialStatuses, managerStatuses, submitterStatuses } from 'types';

export const getPermissions = async ({ userId, submissionId, collectionId, communityId }) => {
	if (!userId) {
		return {};
	}
	const scopeData = await getScope({
		collectionId,
		communityId,
		loginId: userId,
	});
	const isAuthenticated = scopeData.activePermissions.canManage;
	const submissionData = await Submission.findOne({ where: { id: submissionId } });

	if (!submissionData) {
		return { create: isAuthenticated };
	}
	const editProps = ['status'];
	return {
		setSubmittedStatus: true,
		manageStatus: true,
		create: isAuthenticated,
		update: isAuthenticated && editProps,
		destroy: isAuthenticated,
	};
};

export const canUpdate = async ({ userId, collectionId, status, submissionId }) => {
	const { status: oldStatus, pubId } = await Submission.findOne({ where: { id: submissionId } });
	const { activePermissions } = await getScope({ pubId, loginId: userId, collectionId });
	const { canManage } = activePermissions;
	const canSubmitPub = canManage && status in submitterStatuses && oldStatus in initialStatuses;
	const canManagePub = canManage && status in managerStatuses;
	return canSubmitPub || canManagePub;
};
