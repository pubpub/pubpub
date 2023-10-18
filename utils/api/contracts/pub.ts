import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import { createGetManyQueryOptions, createGetQueryOptions } from 'utils/query';

import { resourceSchema } from '../schemas/resource';
import {
	getManyQuerySchema,
	optionalPubCreateParamSchema,
	pubCreateSchema,
	pubPutSchema,
	pubSchema,
	pubWithRelationsSchema,
	resourceASTSchema,
	sanitizedPubSchema,
} from '../schemas/pub';
import { docJsonSchema } from '../schemas/release';
import { sourceFileSchema } from '../schemas/import';

extendZodWithOpenApi(z);

const c = initContract();

export const pubContract = c.router({
	get: {
		path: '/api/pubs/:id',
		method: 'GET',
		summary: "Get a pub by it's id",
		description: 'Get a pub',
		pathParams: z.object({
			id: z.string().uuid(),
		}),
		query: createGetQueryOptions(pubWithRelationsSchema, {
			include: {
				options: [
					'attributions',
					'collectionPubs',
					'community',
					'draft',
					'members',
					'releases',
					'reviews',
					'submission',
					'inboundEdges',
					'outboundEdges',
				],
				defaults: ['attributions', 'draft'],
			},
		}),
		responses: {
			200: pubWithRelationsSchema,
		},
	},
	getMany: {
		path: '/api/pubs',
		method: 'GET',
		summary: 'Get many pubs',
		description: 'Get many pubs',
		query: createGetManyQueryOptions(pubWithRelationsSchema, {
			sort: {
				options: ['title', 'slug'],
			},
			include: {
				options: [
					'attributions',
					'collectionPubs',
					'community',
					'draft',
					'members',
					'releases',
					'reviews',
					'submission',
					'inboundEdges',
					'outboundEdges',
				],
				defaults: ['attributions', 'draft'],
			},
		}),
		responses: {
			200: z.array(pubWithRelationsSchema),
		},
	},
	create: {
		path: '/api/pubs',
		method: 'POST',
		summary: 'Create a Pub',
		description: 'Create a Pub',
		body: pubCreateSchema,
		responses: {
			201: pubSchema,
		},
	},
	update: {
		path: '/api/pubs',
		method: 'PUT',
		summary: 'Update a Pub',
		description: 'Update a Pub',
		body: pubPutSchema,
		responses: {
			200: pubPutSchema.omit({
				pubId: true,
			}),
		},
	},
	remove: {
		path: '/api/pubs',
		method: 'DELETE',
		summary: 'Remove a Pub',
		description: 'Remove a Pub',
		body: z.object({
			pubId: z.string().uuid(),
		}),
		responses: {
			200: z.object({}),
		},
	},
	queryMany: {
		path: '/api/pubs/many',
		method: 'POST',
		summary: 'Search for Pubs',
		description:
			'Search for many pubs. This is an older alternative to the more standardised `GET /api/pubs`, offering different options.',
		body: getManyQuerySchema,
		responses: {
			200: z.object({
				pubIds: z.array(z.string().uuid()),
				pubsById: z.record(sanitizedPubSchema),
				loadedAllPubs: z.boolean().or(z.number()).optional().nullable(),
			}),
		},
	},
	doi: {
		deposit: {
			path: '/api/pub/:pubId/doi',
			method: 'POST',
			summary: 'Create a DOI',
			description: 'Deposit metadata to create a DOI',
			pathParams: z.object({
				pubId: z.string().uuid(),
			}),
			body: z.null().or(z.object({})).optional(),
			responses: {
				200: resourceASTSchema,
				400: z.object({ error: z.string() }),
			},
		},
		preview: {
			path: '/api/pub/:pubId/doi/preview',
			method: 'POST',
			summary: 'Preview a DOI deposit',
			description: 'Preview a DOI deposit',
			pathParams: z.object({
				pubId: z.string().uuid(),
			}),
			body: z.null().or(z.object({})).optional(),
			responses: {
				200: resourceASTSchema,
				400: z.object({ error: z.string() }),
			},
		},
	},
	getResource: {
		path: '/api/pub/:pubId/resource',
		method: 'GET',
		summary: 'Get pub as a resource',
		description: 'Get pub as a resource',
		pathParams: z.object({
			pubId: z.string().uuid(),
		}),
		responses: {
			200: resourceSchema,
		},
	},
	getText: {
		path: '/api/pubs/:pubId/text',
		method: 'GET',
		summary: 'Get the text of a Pub',
		description: 'Get the text of a Pub as a ProseMirror document',
		pathParams: z.object({
			pubId: z.string().uuid(),
		}),
		responses: {
			200: docJsonSchema,
		},
	},
	replaceText: {
		path: '/api/pubs/:pubId/text',
		method: 'PUT',
		summary: 'Replace the text of a pub',
		description: 'Replace the text of a pub with a different ProseMirror document',
		pathParams: z.object({
			pubId: z.string().uuid(),
		}),
		body: z.object({
			doc: docJsonSchema,
			clientID: z.string().default('api'),
			publishRelease: z.boolean().default(false),
		}),
		responses: {
			200: z.object({
				doc: docJsonSchema,
				url: z.string().url().optional(),
			}),
			400: z.object({ error: z.string() }),
		},
	},
	import: {
		path: '/api/pubs/import',
		method: 'POST',
		summary: 'Create a pub and import files to it',
		description: 'Create a pub and upload a file and import it to a pub.',
		body: z.object({
			pub: optionalPubCreateParamSchema
				.extend({ collectionId: z.string().uuid().optional() })
				.partial()
				.optional(),
			sourceFiles: z.array(sourceFileSchema),
		}),
		responses: {
			201: z.object({ doc: docJsonSchema, pub: pubSchema }),
		},
	},
	importToPub: {
		path: '/api/pubs/:pubId/import',
		method: 'POST',
		summary: 'Import a file to a pub',
		description: 'Upload a file and import it to a pub.',
		body: z.object({
			method: z.enum(['replace', 'append', 'prepend', 'overwrite']).optional(),
			sourceFiles: z.array(sourceFileSchema),
		}),
		responses: {
			201: docJsonSchema,
		},
	},
	importLocal: {
		path: '/api/pubs/importLocal',
		method: 'POST',
		contentType: 'multipart/form-data',
		body: optionalPubCreateParamSchema
			.extend({ collectionId: z.string().uuid().optional() })
			.partial()
			.extend({
				filenames: z.array(z.string()),
				files: z.custom<Blob[]>(),
			}),
		responses: {
			200: z.any(),
		},
	},
});
