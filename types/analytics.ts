import type { z } from 'zod';
import type {
	analyticsEventSchema,
	pageViewPayloadSchema,
	pubDownloadSchema,
	pageViewSchema,
} from 'utils/api/schemas/analytics';

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export type PageViewPayload = z.infer<typeof pageViewPayloadSchema>;

export type PageView = z.infer<typeof pageViewSchema>;

export type PubDownload = Omit<z.infer<typeof pubDownloadSchema>, 'timestamp' | 'type'>;

export type Tracks = PubDownload;
