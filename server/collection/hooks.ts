import { Collection } from 'server/models';
import { defer } from 'server/utils/deferred';
import {
	createCollectionActivityItem,
	createCollectionUpdatedActivityItem,
} from 'server/activityItem/queries';

Collection.afterCreate((collection, { actorId }) =>
	defer(() => createCollectionActivityItem('collection-created', actorId ?? null, collection.id)),
);

Collection.afterUpdate((collection, { actorId }) =>
	defer(() =>
		createCollectionUpdatedActivityItem(
			actorId ?? null,
			collection.id,
			collection._previousDataValues,
		),
	),
);

Collection.beforeDestroy((collection, { actorId }) =>
	defer(() => createCollectionActivityItem('collection-removed', actorId ?? null, collection.id)),
);
