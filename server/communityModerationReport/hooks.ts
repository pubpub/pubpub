import {
	createCommunityModerationReportCreatedActivityItem,
	createCommunityModerationReportRetractedActivityItem,
} from 'server/activityItem/queries';
import { CommunityModerationReport } from 'server/models';
import { defer } from 'server/utils/deferred';

const buildOptions = (report: CommunityModerationReport) => ({
	actorId: report.actorId,
	communityId: report.communityId,
	reportedUserId: report.userId,
	reason: report.reason,
	sourceThreadCommentId: report.sourceThreadCommentId,
});

CommunityModerationReport.afterCreate(async (report) => {
	defer(async () => {
		await createCommunityModerationReportCreatedActivityItem(buildOptions(report));
	});
});

CommunityModerationReport.afterUpdate(async (report) => {
	const previousStatus = report.previous('status');
	if (previousStatus === 'active' && report.status === 'retracted') {
		defer(async () => {
			await createCommunityModerationReportRetractedActivityItem(buildOptions(report));
		});
	}
	if (previousStatus === 'retracted' && report.status === 'active') {
		defer(async () => {
			await createCommunityModerationReportCreatedActivityItem(buildOptions(report));
		});
	}
});
