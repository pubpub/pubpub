import * as types from 'types';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const attributionSchema = z.object({
	id: z.string().uuid(),
	order: z.number().max(1).min(0),
	roles: z.array(z.string()).openapi({ example: types.DEFAULT_ROLES }).nullable(),
	affiliation: z.string().nullable(),
	isAuthor: z.boolean().nullable(),
	userId: z.string().uuid().nullable(),
	name: z.string().nullable(),
	orcid: z.string().nullable(),
	avatar: z.string().url().nullable(),
	title: z.string().nullable().openapi({
		deprecated: true,
		description: 'Legacy field, do not use.',
	}),
}) satisfies z.ZodType<Omit<types.PubAttribution, 'pubId'>>;

export const pubAttributionSchema = attributionSchema.merge(
	z.object({
		pubId: z.string().uuid(),
	}),
);
