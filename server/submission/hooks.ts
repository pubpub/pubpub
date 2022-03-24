import { Submission } from 'server/models';
import { createActivityHooks } from 'server/utils/activityHooks';
import { createSubmissionStatusUpdatedActivityItem } from 'server/activityItem/queries';

createActivityHooks({
	Model: Submission,
	onModelUpdated: createSubmissionStatusUpdatedActivityItem,
});
