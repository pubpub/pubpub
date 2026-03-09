import type { InsertableActivityItemBase } from './base';

export type CommunityModerationReportCreatedActivityItem = InsertableActivityItemBase & {
	kind: 'community-moderation-report-created';
	payload: {
		userId: string;
		community: {
			title: string;
		};
	};
};

export type CommunityModerationReportActivityItem = CommunityModerationReportCreatedActivityItem;
