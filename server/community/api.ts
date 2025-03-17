import { initServer } from '@ts-rest/express';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';

import { createGetRequestIds } from 'utils/getRequestIds';
import { expect } from 'utils/assert';
import { contract } from 'utils/api/contract';
import {
	ensureUserIsCommunityAdmin,
	findCommunityByHostname,
} from 'utils/ensureUserIsCommunityAdmin';

import { Pub } from 'server/pub/model';
import { getPermissions } from './permissions';
import {
	createCommunity,
	getCommunity,
	updateCommunity,
	CommunityURLAlreadyExistsError,
} from './queries';
import { addWorkerTask } from 'server/utils/workers';
import { getWorkerTask } from 'server/workerTask/queries';
import { WorkerTask } from 'server/models';

const getRequestIds = createGetRequestIds<{
	communityId?: string | null;
}>();

const s = initServer();

export const communityServer = s.router(contract.community, {
	// @ts-expect-error
	archive: async ({ req }) => {
		const community = await ensureUserIsCommunityAdmin(req);
		console.log(req.user);

		if (!req.user || !req.user?.dataValues.isSuperAdmin) {
			throw new ForbiddenError();
		}

		const workerTask = await addWorkerTask({
			type: 'archive',
			input: { communityId: community.id },
		});

		let done = false;
		let workerTaskData: WorkerTask | null = null;
		while (!done) {
			workerTaskData = await getWorkerTask({ workerTaskId: workerTask.id });
			if (workerTaskData?.isProcessing === false) {
				done = true;
			}
		}

		if (workerTaskData?.error) {
			throw new Error(workerTaskData.error);
		}

		return {
			body: workerTaskData?.output!,
			status: 200,
		};
		// let offset = 0;
		// const limit = 100;

		// // delete tmp

		// while (true) {
		// 	const pubs = await Pub.findAll({
		// 		where: {
		// 			communityId: community.id,
		// 		},
		// 		include: [
		// 			'releases',
		// 			'reviews',
		// 			'collectionPubs',
		// 			'outboundEdges',
		// 			'inboundEdges',
		// 			'attributions',
		// 		],
		// 	});

		// 	if (pubs.length < limit) {
		// 		break;
		// 	}

		// 	offset += limit;
		// }
		// // 	query: {
		// // 		limit: 125,
		// // 		// attributes: ['id'],
		// // 		include: ['releases', 'reviews', 'collectionPubs', 'outboundEdges', 'inboundEdges', 'attributions'],
		// // 	},
		// // });
		// const filePathAll = join(__dirname, 'allPubs.json');
		// await writeFile(filePathAll, JSON.stringify(pubs.body, null, 2), 'utf-8');

		// const pubIds = pubs.body.map((pub) => pub.id);
		// const pubsWithDiscussions = await pubpub.pub.queryMany({
		// 	query: {
		// 		/* @ts-ignore */
		// 		withinPubIds: pubIds,
		// 		limit: 125,
		// 	},
		// 	alreadyFetchedPubIds: [],
		// 	pubOptions: {
		// 		getDiscussions: true,
		// 		getCollections: true,
		// 	},
		// });

		// type Discussions = (typeof pubsWithDiscussions.body.pubsById)[string]['discussions'];
		// const discussionsByPubId: { [key: string]: Discussions } = {};
		// Object.values(pubsWithDiscussions.body.pubsById).forEach((pub) => {
		// 	discussionsByPubId[pub.id] = pub.discussions;
		// });
		// const filePathDiscussions = join(__dirname, 'allPubDiscussions.json');
		// await writeFile(filePathDiscussions, JSON.stringify(discussionsByPubId, null, 2), 'utf-8');

		// // const collections = await pubpub.collection.getMany({
		// // 	query: {limit: 100}
		// // });
		// // const filePathCollections = join(__dirname, 'allCollections.json');
		// // await writeFile(filePathCollections, JSON.stringify(collections.body, null, 2), 'utf-8');

		// await archiveCommunity(req.body);
	},

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
