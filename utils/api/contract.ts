import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { pubSchema } from 'types/schemas/pub';
import { CanCreatePub } from 'types';
import { validate } from './validation-middleware';

extendZodWithOpenApi(z);

type ValidationInput = Parameters<typeof validate>[0];
export type ValidatedContract = {
	[key in `/api/${string}`]: {
		GET?: ValidationInput;
		POST?: ValidationInput;
		PUT?: ValidationInput;
		DELETE?: ValidationInput;
	};
};

export const contract = {
	'/api/pubs': {
		POST: {
			description: 'Create a Pub',
			security: true,
			tags: ['Pub'],
			body: z
				.object({
					communityId: z.string(),
				})
				.and(
					z.union([
						z.object({
							collectionId: z.string().optional(),
							createPubToken: z.undefined(),
						}),
						z.object({
							createPubToken: z.string().optional(),
							collectionId: z.undefined(),
						}),
						z.object({
							createPubToken: z.undefined(),
							collectionId: z.undefined(),
						}),
					]),
				) satisfies z.ZodType<CanCreatePub>,
			statusCodes: {
				201: pubSchema,
			},
		},
	},
	'/api/collectionPubs': {
		GET: {
			tags: ['CollectionPubs'],
			description: 'Get the pubs associated with a collection',
			security: false,
			query: {
				pubId: z.string().uuid().optional(),
				collectionId: z.string().uuid(),
				communityId: z.string().uuid(),
			},
			response: z.array(pubSchema),
		},
	},
} satisfies ValidatedContract;
