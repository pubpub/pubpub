import { getScope } from 'server/utils/queryHelpers';
import { communityCanUseCustomScripts } from 'utils/customScripts';

export const canSetCustomScript = async ({
	userId,
	communityId,
}: {
	userId: string;
	communityId: string;
}) => {
	if (!communityCanUseCustomScripts(communityId)) {
		return false;
	}
	const {
		activePermissions: { canAdminCommunity },
	} = await getScope({ communityId, loginId: userId });
	return canAdminCommunity;
};
