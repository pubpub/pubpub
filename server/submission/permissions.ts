import { Submission } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';
import { initialStatuses, managerStatuses, submitterStatuses } from 'types';

export const getPermissions = async ({ userId, submissionId, collectionId }) => {
	if (!userId) {
		return {};
	}
	const scopeData = await getScope({
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
		setSubmittedStatus: true,
		manageStatus: true,
		create: isAuthenticated,
		update: isAuthenticated && editProps,
		destroy: isAuthenticated,
	};
};

export const canUpdate = async ({ userId, collectionId, status, submissionId }) => {
	const { status: oldStatus, pubId } = await Submission.findOne({ where: { id: submissionId } });
	const {
		activePermissions: { canManage: canManagePub },
	} = await getScope({ pubId, loginId: userId });
	const {
		activePermissions: { canManage: canManageCollection },
	} = await getScope({ collectionId, loginId: userId });
	return (
		(canManagePub && status in submitterStatuses && oldStatus in initialStatuses) ||
		(canManageCollection && status in managerStatuses)
	);
};
