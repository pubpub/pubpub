import { prepareResource, submitResource } from 'deposit/datacite/deposit';
import { generateDoi } from 'server/doi/queries';
import app, { wrap } from 'server/server';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';
import { expect } from 'utils/assert';

import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import { transformCollectionToResource } from 'deposit/transform/collection';
import { contract } from 'utils/api/contract';
import { createGetRequestIds } from 'utils/getRequestIds';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { getPermissions } from './permissions';
import { createCollection, destroyCollection, findCollection, updateCollection } from './queries';

extendZodWithOpenApi(z);

const getRequestIds = createGetRequestIds<{
	userId?: string;
	communityId?: string;
	id?: string;
}>();

app.post(
	'/api/collection/:collectionId/doi',
	wrap(async (req, res) => {
		const { collectionId } = req.params;
		const collection = await findCollection(collectionId);
		if (!collection) {
			return new NotFoundError();
		}
		const permissions = await getPermissions({
			userId: req.user.id,
			collectionId,
			communityId: collection.communityId,
		});
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const collectionDoi =
			collection.doi ??
			(
				await generateDoi(
					{ communityId: collection.communityId, collectionId, pubId: undefined },
					'collection',
				)
			).collection;
		const resource = await transformCollectionToResource(
			collection.toJSON(),
			collection.community,
		);
		try {
			const { resourceAst } = await submitResource(
				collection,
				resource,
				expect(collectionDoi),
				{ collectionId },
			);
			return res.status(200).json(resourceAst);
		} catch (error) {
			return res.status(400).json({ error: (error as Error).message });
		}
	}),
);

app.post(
	'/api/collection/:collectionId/doi/preview',
	wrap(async (req, res) => {
		const { collectionId } = req.params;
		const collection = await findCollection(collectionId);
		const permissions = await getPermissions({
			userId: req.user.id,
			collectionId,
			communityId: collection.communityId,
		});
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const collectionDoi =
			collection.doi ??
			(
				await generateDoi(
					{ communityId: collection.communityId, collectionId, pubId: undefined },
					'collection',
				)
			).collection;
		const resource = await transformCollectionToResource(
			collection.toJSON(),
			collection.community,
		);
		try {
			const { resourceAst } = await prepareResource(
				collection,
				resource,
				expect(collectionDoi),
			);
			return res.status(200).json(resourceAst);
		} catch (error) {
			return res.status(400).json({ error: (error as Error).message });
		}
	}),
);

const s = initServer();

export const collectionServer = s.router(contract.collection, {
	create: async ({ req, body }) => {
		const requestIds = getRequestIds(body, req.user);
		const permissions = await getPermissions({ ...requestIds });
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newCollection = await createCollection(body, req.user.id);
		return { status: 201, body: newCollection };
	},

	update: async ({ req, body }) => {
		const requestIds = getRequestIds(body, req.user);
		const permissions = await getPermissions({ ...requestIds, collectionId: body.id });
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const updatedValues = await updateCollection(
			{
				...body,
				collectionId: body.id,
			},
			permissions.update,
			req.user.id,
		);
		return { status: 200, body: updatedValues };
	},

	remove: async ({ req, body }) => {
		const requestIds = getRequestIds(body, req.user);
		const permissions = await getPermissions({ ...requestIds, collectionId: body.id });
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		await destroyCollection(
			{
				...body,
				collectionId: body.id,
			},
			req.user.id,
		);
		return { status: 200, body: body.id };
	},
});

app.get(
	'/api/collection/:collectionId/resource',
	wrap(async (req, res) => {
		const { collectionId } = req.params;
		const collection = await findCollection(collectionId);
		if (!collection) {
			return new NotFoundError();
		}
		const resource = await transformCollectionToResource(
			collection.toJSON(),
			collection.community,
		);
		return res.status(200).json(resource);
	}),
);

createExpressEndpoints(contract.collection, collectionServer, app);
