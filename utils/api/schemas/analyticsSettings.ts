import { z } from 'zod';

export const analyticsCredentialsSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('default'),
		credentials: z.null(),
	}),
	z.object({
		type: z.literal('GA'),
		credentials: z.literal(`G-${z.string()}`),
	}),
	z.object({
		type: z.literal('GTM'),
		credentials: z.literal(`GTM-${z.string()}`),
	}),
	z.object({
		type: z.literal('simple'),
		credentials: z.string(),
	}),
	z.object({
		type: z.literal('fathom'),
		credentials: z.string(),
	}),
]);

export const analyticsSettingsSchema = z
	.object({
		id: z.string().uuid(),
	})
	.and(analyticsCredentialsSchema);
