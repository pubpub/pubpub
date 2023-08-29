import * as types from 'types';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { layoutBlockSchema } from 'utils/layout';

extendZodWithOpenApi(z);

const collectionLayoutSchema = z.object({
	isNarrow: z.boolean().optional(),
	blocks: z.array(layoutBlockSchema),
});

export const collectionSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	slug: z
		.string()
		.regex(/^[a-zA-Z0-9-]+$/)
		.min(1)
		.max(280),
	avatar: z.string().url().nullable(),
	isRestricted: z.boolean().nullable(),
	isPublic: z.boolean().nullable(),
	viewHash: z.string().nullable(),
	editHash: z.string().nullable(),
	metadata: z.record(z.any()).nullable(),
	kind: z.enum(types.collectionKinds).nullable(),
	doi: z.string().nullable(),
	readNextPreviewSize: z.enum(types.readNextPreviewSizes).default('choose-best'),
	layout: collectionLayoutSchema,
	layoutAllowsDuplicatePubs: z.boolean().default(false),
	pageId: z.string().uuid().nullable(),
	communityId: z.string().uuid(),
	scopeSummaryId: z.string().uuid().nullable(),
	crossrefDepositRecordId: z.string().uuid().nullable(),
}) satisfies z.ZodType<types.Collection, any, any>;
