import { z } from 'zod';

const basePageViewSchema = z.object({
	type: z.literal('page'),
	url: z.string(),
	title: z.string(),
	referrer: z.string().nullable(),
	unique: z.boolean(),
	search: z.string().optional(),
	communityId: z.string().uuid(),
	communityName: z.string(),
	utm: z
		.object({
			source: z.string().optional(),
			medium: z.string().optional(),
			campaign: z.string().optional(),
			term: z.string().optional(),
			content: z.string().optional(),
		})
		.optional(),
	timestamp: z.string().optional(),
});

const pagePageViewSchema = basePageViewSchema.extend({
	pageViewType: z.literal('page'),
	pageTitle: z.string(),
	pageId: z.string(),
	pageSlug: z.string(),
});

const collectionPageViewSchema = basePageViewSchema.extend({
	pageViewType: z.literal('collection'),
	collectionTitle: z.string(),
	collectionKind: z.enum(['issue', 'conference', 'book', 'tag']),
	collectionId: z.string().uuid(),
	collectionSlug: z.string(),
});

const pubPageViewSchema = basePageViewSchema.extend({
	pageViewType: z.literal('pub'),
	pubTitle: z.string(),
	pubId: z.string().uuid(),
	pubSlug: z.string(),
	collectionIds: z.array(z.string().uuid()),
	primaryCollectionId: z.string().uuid().optional(),
});

export const pageViewSchema = z.discriminatedUnion('pageViewType', [
	pagePageViewSchema,
	collectionPageViewSchema,
	pubPageViewSchema,
]);

export const pubDownloadSchema = z.object({
	type: z.literal('download'),
	format: z.string(),
	pubId: z.string().uuid(),
});

export const eventSchema = z.union([pubDownloadSchema, pageViewSchema]);
