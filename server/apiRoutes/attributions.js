import app from '../server';
import { CollectionAttribution, PubAttribution } from '../models';

import permissions from './permissions/permissions';
import makeAttributionsHandler from './helpers/attributions';
import { communityAdminFor } from './permissions/communityAdmin';
import { pubManagerFor } from './permissions/pubManager';

const makeAttributionsRoutes = (AttributionModel, route) => {
	const attributionsHandler = makeAttributionsHandler(
		AttributionModel,
		({ pubId, userId, communityId }) =>
			permissions.any({
				communityAdmin: communityAdminFor({ userId: userId, communityId: communityId }),
				pubManager: pubManagerFor({ userId: userId, pubId: pubId }),
			}),
	);

	const permissionsObjectFromReq = (req) => ({
		pubId: req.body.pubId,
		communityId: req.body.communityId,
		userId: req.user.id,
	});

	app.post(route, (req, res) =>
		attributionsHandler(permissionsObjectFromReq(req))
			.then(({ createAttribution }) =>
				createAttribution({
					userId: req.body.userId,
					pubId: req.body.pubId,
					name: req.body.name,
					order: req.body.order,
					isAuthor: false,
				}),
			)
			.then((created) => res.status(201).json(created))
			.catch((err) => res.status(500).json(err)),
	);

	app.put(route, (req, res) =>
		attributionsHandler(permissionsObjectFromReq(req))
			.then(({ updateAttribution }) => updateAttribution(req.body.pubAttributionId, req.body))
			.then((updated) => res.status(201).json(updated))
			.catch((err) => res.status(500).json(err)),
	);

	app.delete(route, (req, res) =>
		attributionsHandler(permissionsObjectFromReq(req))
			.then(({ destroyAttribution }) => destroyAttribution(req.body.pubAttributionId))
			.then(() => res.status(201).json(req.body.pubAttributionId))
			.catch((err) => res.status(500).json(err)),
	);
};

makeAttributionsRoutes(PubAttribution, '/api/pubAttributions');
makeAttributionsRoutes(CollectionAttribution, '/api/collectionAttributions');
