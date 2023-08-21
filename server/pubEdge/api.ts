import app, { wrap } from 'server/server';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';

import { validate } from 'utils/api';
import { z } from 'zod';
import * as types from 'types';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createPubEdge, updatePubEdge, destroyPubEdge, getPubEdgeById } from './queries';
import {
	canCreatePubEdge,
	canUpdateOrDestroyPubEdge,
	canApprovePubEdge,
	canApprovePubEdgeWithTargetPubId,
} from './permissions';
import { relationTypes } from 'utils/pubEdge';
import { pubSchema, sanitizedPubSchema } from 'server/pub/api';

extendZodWithOpenApi(z);

const pubEdgeSchema = z.object({
	id: z.string().uuid(),
	pubId: z.string().uuid(),
	externalPublicationId: z.string().uuid().nullable(),
	targetPubId: z.string().uuid().nullable(),
	relationType: z.enum(relationTypes),
	rank: z.string(),
	pubIsParent: z.boolean(),
	approvedByTarget: z.boolean(),
}) satisfies z.ZodType<types.PubEdge>;

const externalPublicationSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	url: z.string().url(),
	contributors: z.array(z.string()).nullable(),
	doi: z.string().nullable(),
	description: z.string().nullable(),
	avatar: z.string().nullable(),
	publicationDate: z.string().nullable(),
});

const externalPublicationCreationSchema = externalPublicationSchema.omit({ id: true }).partial({
	contributors: true,
	doi: true,
	description: true,
	avatar: true,
	publicationDate: true,
});

app.get(
	'/api/pubEdges/:id',
	validate({
		tags: ['PubEdges'],
		description: 'Get a pubEdge by id',
		security: false,
		params: {
			id: z.string().uuid(),
		},
		response: pubEdgeSchema,
	}),
	wrap(async (req, res) => {
		const edgeId = req.params.id;
		const edge = await getPubEdgeById(edgeId);

		if (edge) {
			res.status(200).json(edge);
		} else {
			throw new NotFoundError();
		}
	}),
);

const pubEdgeCreationSchema = pubEdgeSchema
	.omit({ id: true, externalPublicationId: true, targetPubId: true })
	.partial({
		rank: true,
		approvedByTarget: true,
	})
	.and(
		z.union([
			z.object({
				targetPubId: z.string().uuid(),
				externalPublication: z.undefined().optional(),
			}),
			z.object({
				targetPubId: z.undefined().optional(),
				externalPublication: externalPublicationCreationSchema,
			}),
		]),
	);

app.post(
	'/api/pubEdges',
	validate({
		tags: ['PubEdges'],
		description: 'Create a connection from one pub to another, or to an external publication',
		body: pubEdgeCreationSchema,
		statusCodes: {
			201: pubEdgeSchema.extend({
				targetPub: sanitizedPubSchema.omit({
					releaseNumber: true,
					discussions: true,
					isRelease: true,
				}),
			}),
		},
	}),
	wrap(async (req, res) => {
		const { pubId, pubIsParent, relationType, targetPubId, externalPublication } = req.body;
		const userId = req.user.id;
		const [canCreate, approvedByTarget] = await Promise.all([
			canCreatePubEdge({ userId, pubId }),
			canApprovePubEdgeWithTargetPubId({ targetPubId, userId }),
		]);
		if (canCreate) {
			const edge = await createPubEdge({
				pubId,
				targetPubId,
				externalPublication,
				pubIsParent,
				relationType,
				approvedByTarget,
				actorId: userId,
			});

			// @ts-expect-error FIXME: edge.targetPub.customPublishedAt is Date | null, but "should" be string | null
			// this turns into string | null when it goes through the API, so it's not a problem
			return res.status(201).json(edge);
		}
		throw new ForbiddenError();
	}),
);

const pubEdgeUpdateSchema = pubEdgeSchema
	.omit({ id: true, externalPublicationId: true, targetPubId: true })
	.partial({
		rank: true,
		approvedByTarget: true,
		pubIsParent: true,
		relationType: true,
	})
	.extend({
		pubEdgeId: pubEdgeSchema.shape.id,
	})
	.and(
		z.union([
			z.object({
				targetPubId: z.string().uuid(),
				externalPublication: z.undefined().optional(),
			}),
			z.object({
				targetPubId: z.undefined().optional(),
				externalPublication: externalPublicationCreationSchema.partial(),
			}),
		]),
	);

app.put(
	'/api/pubEdges',
	validate({
		tags: ['PubEdges'],
		description: 'Update a pubEdge',
		body: pubEdgeUpdateSchema,
		response: pubEdgeSchema,
	}),
	wrap(async (req, res) => {
		const {
			pubEdgeId,
			rank,
			pubId,
			pubIsParent,
			relationType,
			targetPubId,
			externalPublication,
		} = req.body;
		const canUpdateEdge = await canUpdateOrDestroyPubEdge({
			pubEdgeId,
			userId: req.user.id,
		});
		if (canUpdateEdge) {
			const edge = await updatePubEdge({
				pubEdgeId,
				rank,
				pubId,
				pubIsParent,
				relationType,
				targetPubId,
				externalPublication,
			});
			return res.status(200).json(edge);
		}
		throw new ForbiddenError();
	}),
);

app.put(
	'/api/pubEdges/approvedByTarget',
	wrap(async (req, res) => {
		const { pubEdgeId, approvedByTarget } = req.body;
		const canApproveEdge = await canApprovePubEdge({
			pubEdgeId,
			userId: req.user.id,
		});
		if (canApproveEdge) {
			const edge = await updatePubEdge({
				pubEdgeId,
				approvedByTarget,
			});
			return res.status(200).json(edge);
		}
		throw new ForbiddenError();
	}),
);

app.delete(
	'/api/pubEdges',
	validate({
		tags: ['PubEdges'],
		description: 'Remove a connection for a pub',
		body: z.object({
			pubEdgeId: z.string().uuid(),
		}),
		response: {},
	}),
	wrap(async (req, res) => {
		const { pubEdgeId } = req.body;
		const userId = req.user.id;
		const canDestroyEdge = await canUpdateOrDestroyPubEdge({
			pubEdgeId,
			userId,
		});
		if (canDestroyEdge) {
			await destroyPubEdge(pubEdgeId, userId);
			return res.status(200).json({});
		}
		throw new ForbiddenError();
	}),
);
