import { AppRouter } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const analyticsSettingsRouter = {
	// TODO:
} satisfies AppRouter;

type AnalyticsSettingsRouterType = typeof analyticsSettingsRouter;

export interface AnalyticsSettingsRouter extends AnalyticsSettingsRouterType {}
