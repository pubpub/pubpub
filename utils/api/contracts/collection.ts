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

export const collectionContract = c.router(
	{
		create: {
			path: '/api/collections',
			method: 'POST',
			description: 'Create a collection',
			body: collectionCreationSchema,
			responses: {
				201: collectionSchema,
			},
		},
		update: {
			path: '/api/collections',
			method: 'PUT',
			description: 'Create a collection',
			body: collectionUpdateSchema,
			responses: {
				200: collectionCreationSchema.partial(),
			},
		},
		remove: {
			path: '/api/collections',
			method: 'DELETE',
			description: 'Delete a collection',
			body: collectionRemoveSchema,
			responses: {
				200: collectionSchema.shape.id,
			},
		},
	},
	{
		strictStatusCodes: true,
	},
);
