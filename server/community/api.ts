import { initServer } from '@ts-rest/express';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';

import { createGetRequestIds } from 'utils/getRequestIds';
import { expect } from 'utils/assert';
import { contract } from 'utils/api/contract';
import { findCommunityByHostname } from 'utils/ensureUserIsCommunityAdmin';

import { getPermissions } from './permissions';
import {
	createCommunity,
	getCommunity,
	updateCommunity,
	CommunityURLAlreadyExistsError,
} from './queries';

const getRequestIds = createGetRequestIds<{
	communityId?: string | null;
}>();

const s = initServer();

export const communityServer = s.router(contract.community, {
	getCommunities: async ({ req }) => {
		const community = expect(await findCommunityByHostname(req.hostname));

		return {
			body: [community],
			status: 200,
		};
	},
	get: async ({ params }) => {
		const community = await getCommunity(params.id);

		if (!community) {
			throw new NotFoundError();
		}

		return {
			body: community,
			status: 200,
		};
	},
	create: async ({ req }) => {
		if (!req.user || !req.user?.dataValues.isSuperAdmin) {
			throw new ForbiddenError();
		}
		try {
			const newCommunity = await createCommunity(req.body, req.user);
			return {
				body: `https://${newCommunity.subdomain}.pubpub.org`,
				status: 201,
			};
		} catch (e) {
			if (e instanceof CommunityURLAlreadyExistsError) {
				return {
					body: e.message,
					status: 409,
				};
			}
			console.error(e);

			throw new Error('Failed to create community');
		}
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
