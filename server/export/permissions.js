import { CommunityAdmin, PubManager, Branch } from '../models';
import { getBranchAccess } from '../branch/permissions';

export const getPermissions = async ({ branchId, userId, accessHash }) => {
	const branchData = await Branch.findOne({ where: { id: branchId } });
	const [pubManager, communityAdmin] = Promise.all(
		PubManager.findOne({
			where: { userId: userId, pubId: branchData.pubId },
			raw: true,
		}),
		CommunityAdmin.findOne({
			where: { userId: userId, communityId: branchData.pubId },
			raw: true,
		}),
	);
	const branchAccess = getBranchAccess(
		accessHash,
		branchData,
		userId,
		communityAdmin,
		pubManager,
	);
	return {
		create: branchAccess.canView,
	};
};
