import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import {
	communityCreateSchema,
	communitySchema,
	communityUpdateSchema,
} from '../schemas/community';

extendZodWithOpenApi(z);

const c = initContract();

export const communityContract = c.router({
	getId: {
		path: '/api/communities/id',
		method: 'GET',
		summary: 'Get the current community id',
		description: 'Get the current community id. Accessible by anyone',
		responses: {
			200: z.string().uuid(),
		},
	},
	getSelf: {
		path: '/api/communities',
		method: 'GET',
		summary: 'Get the current community',
		description: 'Get the current community. Only works if you are the admin of this community',
		responses: {
			200: communitySchema,
		},
	},
	get: {
		path: '/api/communities/:id',
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
	create: {
		path: '/api/communities',
		method: 'POST',
		summary: 'Create a community',
		description: 'Create a community',
		body: communityCreateSchema,
		responses: {
			201: z.string().url(),
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
