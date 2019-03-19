import app from '../server';

import { Collection } from '../models';
import permissions from './permissions';
import makeCollectionPubHandler from './helpers/collectionPubs';
import { communityAdminFor } from './permissions/communityAdmin';

const collectionPubHandler = makeCollectionPubHandler(({ userId, communityId, collectionId }) =>
	permissions.all({
		communityAdmin: communityAdminFor(
			{
				userId: userId,
				communityId: communityId,
				collectionId: collectionId,
			},
			{ collectionId: [Collection, 'communityId'] },
		),
	}),
);

const credentialsFromRequest = (req) => ({
	collectionId: req.body.collectionId,
	communityId: req.body.communityId,
	userId: req.user.id,
});

app.post('/api/collectionPubs', (req, res) =>
	collectionPubHandler(credentialsFromRequest(req))
		.then(({ createCollectionPub }) =>
			createCollectionPub(req.body.pubId, req.body.collectionId),
		)
		.then((created) => res.status(201).json(created))
		.catch((err) => res.status(401).json(err)),
);

app.put('/api/collectionPubs', (req, res) =>
	collectionPubHandler(credentialsFromRequest(req))
		.then(({ updateCollectionPub }) => updateCollectionPub(req.body.id, req.body))
		.then((updated) => res.status(201).json(updated))
		.catch((err) => res.status(401).json(err)),
);

app.delete('/api/collectionPubs', (req, res) =>
	collectionPubHandler(credentialsFromRequest(req))
		.then(({ destroyCollectionPub }) => destroyCollectionPub(req.body.id))
		.then(() => res.status(201).json())
		.catch((err) => res.status(401).json(err)),
);
