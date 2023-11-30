import type { AppRouter } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createCustomScriptSchema, customScriptSchema } from '../schemas/customScript';

extendZodWithOpenApi(z);

export const customScriptRouter = {
	/**
	 * summary: 'Set a custom script'
	 *
	 * @description
	 * 'Set a custom scripts, e.g. the CSS or JS (if you have access) for this community'
	 */

	set: {
		path: '/api/customScripts',
		method: 'POST',
		summary: 'Set a custom script',
		description:
			'Set a custom scripts, e.g. the CSS or JS (if you have access) for this community',
		body: createCustomScriptSchema,
		responses: {
			200: customScriptSchema,
		},
	},
} as const satisfies AppRouter;

type CustomScriptRouterType = typeof customScriptRouter;

export interface CustomScriptRouter extends CustomScriptRouterType {}
