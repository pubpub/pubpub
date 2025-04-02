import { ForbiddenError } from 'server/utils/errors';

import { AppRouteImplementation } from '@ts-rest/express';
import { contract } from 'utils/api/contract';
import { createGetRequestIds } from 'utils/getRequestIds';
import { getPermissions } from './permissions';
import { getOrStartDownloadTask } from './queries';

const getRequestData = createGetRequestIds<{
	accessHash?: string | null;
	format?: string;
	historyKey?: number;
	pubId?: string;
	communityId?: string;
}>();

export const downloadRouteImplementation: AppRouteImplementation<
	typeof contract.workerTask.createDownload
> = async ({ req, body }) => {
	const { accessHash, userId, communityId } = getRequestData(body, req.user);
	const permissions = await getPermissions({
		accessHash,
		userId,
		communityId,
	});

	if (!permissions.create) {
		throw new ForbiddenError();
	}

	const result = await getOrStartDownloadTask({
		communityId,
	});

	return { status: 201, body: result };
};
