import { prepareResource, submitResource } from 'deposit/datacite/deposit';
import { generateDoi } from 'server/doi/queries';
import app, { wrap } from 'server/server';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';
import { expect } from 'utils/assert';

import * as types from 'types';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import { transformCollectionToResource } from 'deposit/transform/collection';
import { layoutBlockSchema } from 'utils/layout';
import { validate } from 'utils/api';
import { createGetRequestIds } from 'utils/getRequestIds';
import { getPermissions } from './permissions';
import { createCollection, destroyCollection, findCollection, updateCollection } from './queries';

extendZodWithOpenApi(z);

const getRequestIds = createGetRequestIds<{
	userId?: string;
	communityId?: string;
	id?: string;
}>();

const collectionLayoutSchema = z.object({
	isNarrow: z.boolean().optional(),
	blocks: z.array(layoutBlockSchema),
});

export const collectionSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	slug: z
		.string()
		.regex(/^[a-zA-Z0-9-]+$/)
		.min(1)
		.max(280),
	avatar: z.string().url().nullable(),
	isRestricted: z.boolean().nullable(),
	isPublic: z.boolean().nullable(),
	viewHash: z.string().nullable(),
	editHash: z.string().nullable(),
	metadata: z.record(z.any()).nullable(),
	kind: z.enum(types.collectionKinds).nullable(),
	doi: z.string().nullable(),
	readNextPreviewSize: z.enum(types.readNextPreviewSizes).default('choose-best'),
	layout: collectionLayoutSchema,
	layoutAllowsDuplicatePubs: z.boolean().default(false),
	pageId: z.string().uuid().nullable(),
	communityId: z.string().uuid(),
	scopeSummaryId: z.string().uuid().nullable(),
	crossrefDepositRecordId: z.string().uuid().nullable(),
}) satisfies z.ZodType<types.Collection, any, any>;

const collectionCreationSchema = collectionSchema
	.omit({ id: true })
	.pick({
		communityId: true,
		title: true,
		pageId: true,
		doi: true,
		isPublic: true,
		isRestricted: true,
		slug: true,
	})
	.required({
		communityId: true,
		title: true,
	})
	.partial({
		pageId: true,
		doi: true,
		isPublic: true,
		isRestricted: true,
		slug: true,
	})
	.extend({ kind: collectionSchema.shape.kind.unwrap() });

app.post(
	'/api/collections',
	validate({
		tags: ['Collections'],
		description: 'Create a collection',
		body: collectionCreationSchema,
		statusCodes: {
			201: collectionSchema,
		},
	}),
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions({ ...requestIds });
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newCollection = await createCollection(req.body, req.user.id);
		return res.status(201).json(newCollection);
	}),
);

app.put(
	'/api/collections',
	validate({
		tags: ['Collections'],
		description: 'Create a collection',
		body: collectionSchema
			.pick({
				title: true,
				slug: true,
				isRestricted: true,
				isPublic: true,
				pageId: true,
				metadata: true,
				readNextPreviewSize: true,
				layout: true,
				layoutAllowsDuplicatePubs: true,
				avatar: true,
			})
			.partial()
			.extend({
				id: collectionSchema.shape.id,
				communityId: collectionSchema.shape.communityId,
			}),
		statusCodes: {
			200: collectionCreationSchema.partial(),
		},
	}),
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions({ ...requestIds, collectionId: req.body.id });
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const updatedValues = await updateCollection(
			{
				...req.body,
				collectionId: req.body.id,
			},
			permissions.update,
			req.user.id,
		);
		return res.status(200).json(updatedValues);
	}),
);

app.delete(
	'/api/collections',
	validate({
		tags: ['Collections'],
		description: 'Delete a collection',
		body: z.object({
			id: collectionSchema.shape.id,
			communityId: collectionSchema.shape.communityId,
		}),
		response: collectionSchema.shape.id,
	}),
	wrap(async (req, res) => {
		const requestIds = getRequestIds(req);
		const permissions = await getPermissions({ ...requestIds, collectionId: req.body.id });
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		await destroyCollection(
			{
				...req.body,
				collectionId: req.body.id,
			},
			req.user.id,
		);
		return res.status(200).json(req.body.id);
	}),
);

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
