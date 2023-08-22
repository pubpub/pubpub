import { z } from 'zod';
import * as types from 'types';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const pubSchema = z.object({
	id: z.string().uuid(),
	slug: z
		.string({
			description: 'Slug',
		})
		.regex(/^[a-zA-Z0-9-]+$/)
		.min(1)
		.max(280)
		.openapi({
			uniqueItems: true,
			example: 'some-slug',
		}),
	title: z.string().openapi({
		example: 'A beautiful title',
	}),
	htmlTitle: z.string().nullable().openapi({
		example: 'A <strong>beautiful</strong> <em>title</em>',
		description:
			'HTML version of the title, allows for things like <strong>bold</strong> and <em>italics</em>',
	}),
	description: z.string().max(280).min(0).nullable(),
	htmlDescription: z.string().max(280).min(0).nullable(),
	avatar: z.string({}).nullable().openapi({
		description: 'The preview image of a Pub',
	}),
	doi: z.string().nullable().openapi({
		example: '10.1101/2020.05.01.072975',
		description: 'The DOI of the pub',
	}),
	downloads: z
		.array(
			z.object({
				url: z.string().url(),
				type: z.literal('formatted'),
				createdAt: z
					.string()
					.datetime()
					.default(() => new Date().toISOString()),
			}),
		)
		.nullable(),
	customPublishedAt: z.string().datetime().nullable(),
	labels: z
		.array(
			z.object({
				id: z.string().uuid(),
				color: z.string(),
				title: z.string(),
				publicApply: z.boolean(),
			}),
		)
		.nullable(),
	viewHash: z.string().nullable(),
	reviewHash: z.string().nullable(),
	editHash: z.string().nullable(),
	commentHash: z.string().nullable(),
	communityId: z.string().uuid(),
	metadata: z
		.object({
			mtg_id: z.string().openapi({ example: 'aas241' }),
			bibcode: z.string().openapi({ example: '2023AAS…24130111A' }),
			mtg_presentation_id: z.string().openapi({ example: '301.11' }),
		})
		.nullable(),
	draftId: z.string().uuid(),
	scopeSummaryId: z.string().uuid().nullable(),
	crossrefDepositRecordId: z.string().uuid().nullable(),
}) satisfies z.ZodType<types.Pub>;
