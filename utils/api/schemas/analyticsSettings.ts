import { z } from 'zod';

const googleAnalyticsCredentialsSchema = z.object({
	type: z.literal('GA'),
	credentials: z.literal(`GA-${z.string()}`),
});

const simpleAnalyticsCredentialsSchema = z.object({
	type: z.literal('simple'),
	credentials: z.null(),
});

/**
 * Schema for analytics settings.
 *
 * `null` means only our own analytics are enabled.
 */
export const analyticsSettingsSchema = z
	.discriminatedUnion('type', [
		googleAnalyticsCredentialsSchema,
		simpleAnalyticsCredentialsSchema,
	])
	.nullable()
	.default(null);
