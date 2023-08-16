import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { validate } from 'utils/api';
import { z } from 'zod';
import * as types from 'types';
import { layoutBlockSchema } from 'utils/layout/validators';
import { Page } from 'server/models';
import { createGetRequestIds } from 'utils/getRequestIds';
import { createPage, updatePage, destroyPage } from './queries';
import { getPermissions } from './permissions';

const getRequestIds = createGetRequestIds<{
	communityId?: string;
	pubId?: string;
	pageId?: string;
}>();

app.post(
	'/api/pages',
	validate({
		description: 'Create a page',
		tags: ['Pages'],
		security: true,
		body: z.object({
			communityId: z.string(),
			title: z.string(),
			slug: z.string(),
			description: z.string().nullish(),
			avatar: z.string().nullish(),
		}),
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

app.put(
	'/api/pages',
	validate({
		description: 'Update a page',
		tags: ['Pages'],
		security: true,
		body: z.object({
			title: z.string().optional(),
			slug: z.string().optional(),
			description: z.string().nullish(),
			avatar: z.string().nullish(),
			isPublic: z.boolean().nullish(),
			isNarrowWidth: z.boolean().nullish(),
			layoutAllowDuplicatePubs: z.boolean().nullish(),
			layout: z.array(layoutBlockSchema).optional(),
			communityId: z.string(),
			pageId: z.string(),
		}) satisfies types.UpdateParams<Page>,
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
			communityId: z.string(),
			pageId: z.string(),
		}),
		statusCodes: {
			201: z.string().openapi({
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
