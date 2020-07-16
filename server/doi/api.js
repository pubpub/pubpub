import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';
import xmlbuilder from 'xmlbuilder';

import { getDoiData, setDoiData } from './queries';
import { getPermissions } from './permissions';

const getRequestIds = (req) => {
	const user = req.user || {};
	return {
		userId: user.id,
		communityId: req.body.communityId,
		collectionId: req.body.collectionId || null,
		pubId: req.body.pubId || null,
	};
};

const getRequestIdsFromParams = (req) => {
	const user = req.user || {};
	return {
		userId: user.id,
		communityId: req.query.communityId,
		collectionId: req.query.collectionId || null,
		pubId: req.query.pubId || null,
	};
};

app.post(
	'/api/doi/:target',
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const { pubId, collectionId, communityId } = req.body;
		const { target } = req.params;
		const permissions = await getPermissions(requestIds);
		const isAuthenticated =
			(target === 'pub' && permissions.pub) ||
			(target === 'collection' && permissions.collection);
		if (!isAuthenticated) {
			throw new ForbiddenError();
		}
		const doiJson = await setDoiData(
			{
				communityId: communityId,
				collectionId: collectionId,
				pubId: pubId,
			},
			target,
		);
		return res.status(201).json(doiJson);
	}),
);

app.get(
	'/api/doiPreview',
	wrap(async (req, res) => {
		const requestIds = getRequestIdsFromParams(req);
		const { pubId, collectionId, communityId, target } = req.query;
		const permissions = await getPermissions(requestIds);
		const isAuthenticated =
			(target === 'pub' && permissions.pub) ||
			(target === 'collection' && permissions.collection);
		if (!isAuthenticated) {
			throw new ForbiddenError();
		}
		const depositJson = await getDoiData(
			{
				communityId: communityId,
				collectionId: collectionId,
				pubId: pubId,
			},
			target,
		);
		const depositXml = xmlbuilder.create(depositJson, { headless: true }).end({ pretty: true });

		return res.status(201).json({
			depositJson: depositJson,
			depositXml: depositXml,
		});
	}),
);
