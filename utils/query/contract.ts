import { z } from 'zod';
import { createGetManyQueryOptions } from './createGetManyQuery';

export const createGetManyContract = <S extends z.ZodObject<any>>(
	schema: S,
	queryOptions: Parameters<typeof createGetManyQueryOptions<S>>[1],
	contractOptions: {},
) => ({
	path: '/api/collections',
	method: 'GET',
	summary: 'Get many collections',
	description: 'Get many collections',
	query: createGetManyQueryOptions(schema, queryOptions),
	responses: {
		200: z.array(schema),
	},
});
