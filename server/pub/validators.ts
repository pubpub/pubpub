import * as types from 'types';
import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';

export type PubPut = Partial<
	Pick<
		types.Pub,
		| 'avatar'
		| 'doi'
		| 'description'
		| 'htmlDescription'
		| 'title'
		| 'htmlTitle'
		| 'downloads'
		| 'slug'
	>
> & { pubId: string };

export const putSchema = extendApi(
	z.object({
		pubId: extendApi(z.string(), {
			description: 'The id of the pub to update',
		}),
		avatar: extendApi(z.string().optional(), {
			description: 'The avatar of the pub',
		}),
		doi: extendApi(z.string().optional(), {
			description: 'The doi of the pub',
		}),
		description: extendApi(z.string().optional(), {
			description: 'The description of the pub',
		}),
		htmlDescription: extendApi(z.string().optional(), {
			description: 'The htmlDescription of the pub',
		}),
		title: extendApi(z.string().optional(), {
			description: 'The title of the pub',
		}),
		htmlTitle: extendApi(z.string().optional(), {
			description: 'The htmlTitle of the pub',
		}),
		downloads: extendApi(
			z
				.object({
					url: z.string(),
					type: z.enum(['formatted', 'raw']),
					createdAt: z
						.string()
						.datetime()
						.default(() => new Date().toISOString()),
				})
				.array()
				.optional(),
			{
				description: 'The downloads of the pub',
			},
		),
		slug: extendApi(z.string().optional(), {
			description: 'The slug of the pub',
		}),
	}),
	{
		title: 'PUT Pub',
		description: "Update a pub's metadata",
	},
) satisfies z.ZodType<PubPut>;
