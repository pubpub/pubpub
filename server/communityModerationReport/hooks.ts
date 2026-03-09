import { createCommunityModerationReportCreatedActivityItem } from 'server/activityItem/queries';
import { CommunityModerationReport } from 'server/models';
import { defer } from 'server/utils/deferred';

CommunityModerationReport.afterCreate(async (report) => {
	defer(async () => {
		await createCommunityModerationReportCreatedActivityItem(
			report.actorId,
			report.communityId,
			report.userId,
		);
	});
});
