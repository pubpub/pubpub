import { Community } from 'server/models';
import { defer } from 'server/utils/deferred';
import {
	createCommunityCreatedActivityItem,
	createCommunityUpdatedActivityItem,
} from 'server/activityItem/queries';

Community.afterCreate((community, { actorId }) =>
	defer(() => createCommunityCreatedActivityItem(actorId, community.id)),
);

Community.afterUpdate((community, { actorId }) =>
	defer(() =>
		createCommunityUpdatedActivityItem(
			actorId ?? null,
			community.id,
			community._previousDataValues,
		),
	),
);
