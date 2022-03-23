import { Submission } from 'server/models';
import { createActivityHooks } from 'server/utils/activityHooks';
import { createSubmissionStatusChangedActivityItem } from 'server/activityItem/queries';

createActivityHooks({
	Model: Submission,
	onModelUpdated: createSubmissionStatusChangedActivityItem,
});
