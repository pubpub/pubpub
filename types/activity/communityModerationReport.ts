import type { ModerationReportReason } from '../spam';
import type { InsertableActivityItemBase } from './base';

type CommunityModerationReportActivityItemBase = InsertableActivityItemBase & {
	payload: {
		userId: string;
		community: {
			title: string;
		};
		reason?: ModerationReportReason | null;
		sourceThreadCommentId?: string | null;
		sourcePubId?: string | null;
		sourcePubTitle?: string | null;
	};
};

export type CommunityModerationReportCreatedActivityItem =
	CommunityModerationReportActivityItemBase & {
		kind: 'community-moderation-report-created';
	};

export type CommunityModerationReportRetractedActivityItem =
	CommunityModerationReportActivityItemBase & {
		kind: 'community-moderation-report-retracted';
	};

export type CommunityModerationReportActivityItem =
	| CommunityModerationReportCreatedActivityItem
	| CommunityModerationReportRetractedActivityItem;
