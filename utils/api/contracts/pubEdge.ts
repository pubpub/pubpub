import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { pubEdgeCreateSchema, pubEdgeSchema, pubEdgeUpdateSchema } from '../schemas/pubEdge';
import { sanitizedPubSchema } from '../schemas/pub';

extendZodWithOpenApi(z);

const c = initContract();

export const pubEdgeContract = c.router({
	get: {
		path: '/api/pubEdges/:id',
		method: 'GET',
		description: 'Get a pubEdge by id',
		pathParams: z.object({
			id: z.string().uuid(),
		}),
		responses: {
			200: pubEdgeSchema,
		},
	},
	create: {
		path: '/api/pubEdges',
		method: 'POST',
		description: 'Create a connection from one pub to another, or to an external publication',
		body: pubEdgeCreateSchema,
		responses: {
			201: pubEdgeSchema.extend({
				targetPub: sanitizedPubSchema.omit({
					releaseNumber: true,
					discussions: true,
					isRelease: true,
				}),
			}),
		},
	},
	update: {
		path: '/api/pubEdges',
		method: 'PUT',
		description: 'Update a pubEdge',
		body: pubEdgeUpdateSchema,
		responses: { 200: pubEdgeSchema },
	},
	updateApprovedByTarget: {
		path: '/api/pubEdges/approvedByTarget',
		method: 'PUT',
		description: 'Update the approvedByTarget field of a pubEdge',
		body: z.object({
			pubEdgeId: z.string().uuid(),
			approvedByTarget: z.boolean(),
		}),
		responses: {
			200: pubEdgeSchema,
		},
	},
	remove: {
		path: '/api/pubEdges',
		method: 'DELETE',
		description: 'Remove a connection for a pub',
		body: z.object({
			pubEdgeId: z.string().uuid(),
		}),
		responses: {
			200: z.object({}),
		},
	},
});
