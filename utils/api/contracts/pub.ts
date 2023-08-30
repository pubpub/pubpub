import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

import {
	getManyQuerySchema,
	pubPostSchema,
	pubPutSchema,
	pubSchema,
	sanitizedPubSchema,
} from '../schemas/pub';

extendZodWithOpenApi(z);

const c = initContract();

export const pubContract = c.router(
	{
		create: {
			path: '/api/pubs',
			method: 'POST',
			summary: 'Create a Pub',
			description: 'Create a Pub',
			body: pubPostSchema,
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
		getMany: {
			path: '/api/pubs/many',
			method: 'POST',
			summary: 'Search for Pubs',
			description: 'Get many pubs',
			body: getManyQuerySchema,
			responses: {
				200: z.object({
					pubIds: z.array(z.string().uuid()),
					pubsById: z.record(sanitizedPubSchema),
					loadedAllPubs: z.boolean().or(z.number()).optional().nullable(),
				}),
			},
		},
	},
	{
		strictStatusCodes: true,
	},
);
