import { AppRouter } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const publicPermissionsRouter = {
	updateDiscussions: {
		path: '/api/publicPermissions/discussions',
		method: 'PUT',
		summary: 'Update who is able to create new discussions',
		body: z.object({
			discussionCreationAccess: z.enum(['public', 'contributors', 'members', 'disabled']),
		}),
		responses: {
			200: z.object({ success: z.boolean() }),
		},
	},
} satisfies AppRouter;

type PublicPermissionsRouterType = typeof publicPermissionsRouter;

export interface PublicPermissionsRouter extends PublicPermissionsRouterType {}
