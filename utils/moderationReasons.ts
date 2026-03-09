import type { ModerationReportReason } from 'types';

export const moderationReasonLabels: Record<ModerationReportReason, string> = {
	'spam-content': 'Spam',
	'hateful-language': 'Hateful language',
	harassment: 'Harassment',
	impersonation: 'Impersonation',
	other: 'Other',
};

export const getReasonLabel = (reason: ModerationReportReason): string =>
	moderationReasonLabels[reason] ?? reason;
