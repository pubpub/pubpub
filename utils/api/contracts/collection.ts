import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import {
	collectionCreationSchema,
	collectionRemoveSchema,
	collectionSchema,
	collectionUpdateSchema,
} from '../schemas/collection';

extendZodWithOpenApi(z);

const c = initContract();

export const collectionContract = c.router({
	create: {
		path: '/api/collections',
		method: 'POST',
		summary: 'Create a collection',
		description: 'Create a collection',
		body: collectionCreationSchema,
		responses: {
			201: collectionSchema,
		},
	},
	update: {
		path: '/api/collections',
		method: 'PUT',
		summary: 'Update a collection',
		description: 'Update a collection',
		body: collectionUpdateSchema,
		responses: {
			200: collectionCreationSchema.partial(),
		},
	},
	remove: {
		path: '/api/collections',
		method: 'DELETE',
		summary: 'Remove a collection',
		description: 'Remove a collection',
		body: collectionRemoveSchema,
		responses: {
			200: collectionSchema.shape.id,
		},
	},
});
