import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { validate } from 'utils/api';
import { z } from 'zod';
import * as types from 'types';
import { layoutBlockSchema } from 'utils/layout/validators';
import { Page } from 'server/models';
import { oldCreateGetRequestIds } from 'utils/getRequestIds';
import { createPage, updatePage, destroyPage } from './queries';
import { getPermissions } from './permissions';

const getRequestIds = oldCreateGetRequestIds<{
	communityId?: string;
	pubId?: string;
	pageId?: string;
}>();

const pageSchema = z.object({
	id: z.string().uuid(),
	title: z.string().nonempty(),
	slug: z.string().nonempty().openapi({
		description: 'The URL slug for the page',
	}),
	description: z.string().nullable(),
	avatar: z.string().url().nullable().openapi({
		description: 'URL of the preview image',
	}),
	isPublic: z.boolean().default(false),
	isNarrowWidth: z.boolean().nullable(),
	viewHash: z.string().nullable(),
	layout: z.array(layoutBlockSchema).openapi({
		description: 'The layout of the page, as an array of blocks.',
	}),
	layoutAllowsDuplicatePubs: z.boolean().default(false).openapi({
		description: 'Whether the page allows pubs to reappear in subsequent pub blocks.',
	}),
	communityId: z.string().uuid(),
}) satisfies z.ZodType<types.Page, any, any>;

app.post(
	'/api/pages',
	validate({
		description: 'Create a page',
		tags: ['Pages'],
		security: true,
		body: pageSchema
			.pick({
				communityId: true,
				title: true,
				slug: true,
				description: true,
				avatar: true,
			})
			.partial({
				description: true,
				avatar: true,
			}),
		statusCodes: {
			201: pageSchema,
		},
	}),
	wrap(async (req, res) => {
		const { userId, communityId, pageId } = getRequestIds(req);
		const permissions = await getPermissions({
			userId,
			communityId,
			pageId,
		});
		if (!permissions.create) {
			throw new ForbiddenError();
		}
		const newPage = await createPage(req.body, req.user.id);
		return res.status(201).json(newPage);
	}),
);

const pubUdateSchema = pageSchema
	.omit({ id: true })
	.partial()
	.required({
		communityId: true,
	})
	.extend({
		pageId: pageSchema.shape.id,
	}) satisfies types.UpdateParams<Page>;

app.put(
	'/api/pages',
	validate({
		description: 'Update a page',
		tags: ['Pages'],
		security: true,
		body: pubUdateSchema,
		statusCodes: {
			201: pubUdateSchema.omit({ pageId: true, communityId: true }).partial(),
		},
	}),
	wrap(async (req, res) => {
		const ids = getRequestIds(req);
		const permissions = await getPermissions(ids);
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		const updatedValues = await updatePage(req.body, permissions.update, req.user.id);
		return res.status(201).json(updatedValues);
	}),
);

app.delete(
	'/api/pages',
	validate({
		description: 'Delete a page',
		tags: ['Pages'],
		security: true,
		body: z.object({
			communityId: z.string().uuid(),
			pageId: z.string().uuid(),
		}),
		statusCodes: {
			201: z.string().uuid().openapi({
				description: 'The ID of the deleted page',
			}),
		},
	}),
	wrap(async (req, res) => {
		const ids = getRequestIds(req);
		const permissions = await getPermissions(ids);
		if (!permissions.update) {
			throw new ForbiddenError();
		}
		try {
			await destroyPage(req.body, req.user.id);
			return res.status(201).json(req.body.pageId);
		} catch (e) {
			console.error(e);
			throw new Error(e as string);
		}
	}),
);
