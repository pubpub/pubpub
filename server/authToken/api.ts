import { initServer } from '@ts-rest/express';
import { contract } from 'utils/api/contract';
import { ensureUserIsCommunityAdmin } from 'utils/ensureUserIsCommunityAdmin';
import { AuthToken } from './model';

const s = initServer();

export const authTokenServer = s.router(contract.authToken, {
	create: async ({ body, req }) => {
		const community = await ensureUserIsCommunityAdmin(req);

		const expiresAt = (() => {
			switch (body.expiresAt) {
				case 'never':
					return null;
				case '1d':
					return new Date(Date.now() + 1000 * 60 * 60 * 24);
				case '1w':
					return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
				case '1m':
					return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
				case '3m':
					return new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
				case '1y':
					return new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
				default:
					return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
			}
		})();

		const authToken = await AuthToken.create({
			userId: req.user.id,
			communityId: community.id,
			expiresAt,
		});

		return {
			status: 201,
			body: authToken.toJSON(),
		};
	},
	remove: async ({ params, req }) => {
		const { id: tokenId } = params;

		const community = await ensureUserIsCommunityAdmin(req);
		await AuthToken.destroy({
			where: {
				id: tokenId,
				communityId: community.id,
			},
		});

		return {
			status: 200,
			body: tokenId,
		};
	},
});
