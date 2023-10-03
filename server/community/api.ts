import { initServer } from '@ts-rest/express';
import { ForbiddenError } from 'server/utils/errors';

import { createGetRequestIds } from 'utils/getRequestIds';
import { expect } from 'utils/assert';
import { contract } from 'utils/api';
import { getPermissions } from './permissions';
import {
	createCommunity,
	findCommunityByHostname,
	getCommunity,
	isCommunityAdmin,
	updateCommunity,
} from './queries';

const getRequestIds = createGetRequestIds<{
	communityId?: string | null;
}>();

const s = initServer();

export const communityServer = s.router(contract.community, {
	getId: async ({ req }) => {
		const community = await findCommunityByHostname(req.hostname);

		return {
			body: expect(community).id,
			status: 200,
		};
	},
	getSelf: async ({ req }) => {
		const [canAdmin, community] = await isCommunityAdmin(req);
		if (!canAdmin) {
			throw new ForbiddenError();
		}

		return {
			body: community,
			status: 200,
		};
	},
	get: async ({ params, req }) => {
		const permissions = await getPermissions({
			communityId: params.id,
			userId: req.user?.id || null,
		});

		if (!permissions.update) {
			throw new ForbiddenError();
		}

		const community = expect(await getCommunity(params.id));
		return {
			body: community,
			status: 200,
		};
	},
	create: async ({ req }) => {
		const permissions = await getPermissions({ userId: req.user?.id || null });
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newCommunity = await createCommunity(req.body, req.user);
		return {
			body: `https://${newCommunity.subdomain}.pubpub.org`,
			status: 201,
		};
	},
	update: async ({ body, req }) => {
		const requestIds = getRequestIds(body, req.user);
		const permissions = await getPermissions(requestIds);
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const updatedValues = await updateCommunity(req.body, permissions.update, req.user.id);
		return {
			body: updatedValues,
			status: 200,
		};
	},
});
