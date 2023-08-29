import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

const c = initContract();

export const collectionAttributionContract = c.router({
	// create: {
	// 	path: '/api/collectionAttributions',
	// 	method: 'POST',
	// 	description: 'Create a collection attribution',
	// 	body: z
	// 		.object({
	// 			communityId: z.string().uuid(),
	// 			collectionId: z.string().uuid(),
	// 		})
	// 		.and(attributionCreationSchema),
	// 	responses: {
	// 		201: collectionAttributionSchema,
	// 	},
	// },
});
