import type { z } from 'zod';
import { Prettify } from 'types';
import {
	type analyticsCredentialsSchema,
	type analyticsSettingsSchema,
} from 'utils/api/schemas/analyticsSettings';

export type AnalyticsCredentials = z.infer<typeof analyticsCredentialsSchema>;

export type AnalyticsType = AnalyticsCredentials['type'];

export type Analytics<T extends AnalyticsType = AnalyticsType> = Prettify<
	AnalyticsCredentials & { type: T }
>;

export type AnalyticsSettings = z.infer<typeof analyticsSettingsSchema>;
