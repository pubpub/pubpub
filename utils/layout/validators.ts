import { z } from 'zod';
import { docJsonSchema } from 'types';
import {
	LayoutBlock,
	LayoutBlockBanner,
	LayoutBlockCollectionHeader,
	LayoutBlockCollectionsPages,
	LayoutBlockHtml,
	LayoutBlockPubs,
	LayoutBlockSubmissionBanner,
	LayoutBlockText,
	pubPreviewTypes,
	pubSortOrders,
	textAligns,
} from './types';

export const layoutBlocBannerkSchema = z.object({
	type: z.literal('banner'),
	id: z.string(),
	content: z.object({
		align: z.enum(['left', 'center']).optional(),
		backgroundColor: z.string().optional(),
		backgroundHeight: z.enum(['tall', 'narrow']).optional(),
		backgroundImage: z.string().optional(),
		backgroundSize: z.enum(['full', 'standard']).optional(),
		buttonText: z.string().optional(),
		buttonType: z.enum(['link', 'signup', 'create-pub']).optional(),
		buttonUrl: z.string().optional(),
		showButton: z.boolean().optional(),
		text: z.string().optional(),
	}),
}) satisfies z.ZodType<LayoutBlockBanner>;

export const layoutBlockCollectionPagesSchema = z.object({
	type: z.literal('collections-pages'),
	id: z.string(),
	content: z.object({
		items: z.array(
			z.object({
				type: z.enum(['collection', 'page']),
				id: z.string(),
			}),
		),
		title: z.string().optional(),
		justify: z.enum(['left', 'center', 'space-between', 'space-around']).optional(),
	}),
}) satisfies z.ZodType<LayoutBlockCollectionsPages>;

export const layoutBlockHtmlSchema = z.object({
	type: z.literal('html'),
	id: z.string(),
	content: z.object({
		html: z.string().optional(),
	}),
}) satisfies z.ZodType<LayoutBlockHtml>;

export const layoutBlockPubsSchema = z.object({
	type: z.literal('pubs'),
	id: z.string(),
	content: z.object({
		collectionIds: z.array(z.string()).optional(),
		hideByline: z.boolean().optional(),
		hideContributors: z.boolean().optional(),
		hideDates: z.boolean().optional(),
		hideDescription: z.boolean().optional(),
		hideEdges: z.boolean().optional(),
		limit: z.number().optional(),
		pubIds: z.array(z.string()).optional(),
		pubPreviewType: z.enum(pubPreviewTypes),
		sort: z.enum(pubSortOrders).optional(),
		title: z.string().optional(),
	}),
}) satisfies z.ZodType<LayoutBlockPubs>;

export const layoutBlockTextSchema = z.object({
	type: z.literal('text'),
	id: z.string(),
	content: z.object({
		text: docJsonSchema.optional(),
		align: z.enum(textAligns).optional(),
	}),
}) satisfies z.ZodType<LayoutBlockText>;

export const layoutBlockCollectionHeaderSchema = z.object({
	type: z.literal('collection-header'),
	id: z.string(),
	content: z.object({
		hideByline: z.boolean().optional(),
		hideContributors: z.boolean().optional(),
		hideDate: z.boolean().optional(),
		hideDoi: z.boolean().optional(),
		hideCollectionKey: z.boolean().optional(),
		hiddenMetadataFields: z.array(z.string()).optional(),
	}),
}) satisfies z.ZodType<LayoutBlockCollectionHeader>;

export const layoutBlockSubmissionBannerSchema = z.object({
	type: z.literal('submission-banner'),
	id: z.string(),
	content: z.object({
		title: z.string(),
		body: docJsonSchema,
		submissionWorkflowId: z.string(),
	}),
}) satisfies z.ZodType<LayoutBlockSubmissionBanner>;

export const layoutBlockSchema = z.union([
	layoutBlocBannerkSchema,
	layoutBlockCollectionPagesSchema,
	layoutBlockHtmlSchema,
	layoutBlockPubsSchema,
	layoutBlockTextSchema,
	layoutBlockCollectionHeaderSchema,
	layoutBlockSubmissionBannerSchema,
]) satisfies z.ZodType<LayoutBlock>;
