import { initServer } from '@ts-rest/express';
import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { getPermissions } from './permissions';
import { createCommunity, getCommunity, updateCommunity } from './queries';
import { createGetRequestIds } from 'utils/getRequestIds';
import { communityContract } from 'utils/api/contracts/community';
import { expect } from 'utils/assert';

// const getRequestIds = (req) => {
// 	const user = req.user || {};
// 	return {
// 		userId: user.id,
// 		communityId: req.body.communityId || null,
// 	};
// };

const getRequestIds = createGetRequestIds<{
	communityId: string | null;
}>();

const s = initServer();

app.post(
	'/api/communities',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req.body);
		const permissions = await getPermissions(requestIds);
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newCommunity = await createCommunity(req.body, req.user);
		return res.status(201).json(`https://${newCommunity.subdomain}.pubpub.org`);
	}),
);

export const communityServer = s.router(communityContract, {
	get: async ({ params, req }) => {
		const permissions = await getPermissions({
			communityId: params.id,
			userId: req.user?.id || null,
		});

		if (!permissions.update) {
			throw new ForbiddenError();
		}

		const community = expect(await getCommunity(params.id));
		return community;
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
