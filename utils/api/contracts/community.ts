import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { communitySchema, communityUpdateSchema } from '../schemas/community';

extendZodWithOpenApi(z);

const c = initContract();

export const communityContract = c.router({
	get: {
		path: '/api/community/:id',
		method: 'GET',
		summary: "Get a community by it's id",
		description: 'Get a community',
		pathParams: z.object({
			id: z.string().uuid(),
		}),
		responses: {
			200: communitySchema,
		},
	},
	update: {
		path: '/api/communities',
		method: 'PUT',
		summary: 'Update a community',
		description: 'Update a community',
		body: communityUpdateSchema,
		responses: {
			200: communityUpdateSchema.partial(),
		},
	},
});
