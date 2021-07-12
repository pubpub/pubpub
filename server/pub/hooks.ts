import { Pub } from 'server/models';
import { defer } from 'server/utils/deferred';
import { createPubActivityItem, createPubUpdatedActivityItem } from 'server/activityItem/queries';

Pub.afterCreate((pub, { actorId }) =>
	defer(() => createPubActivityItem('pub-created', actorId ?? null, pub.id)),
);

Pub.afterUpdate((pub, { actorId }) =>
	defer(() => createPubUpdatedActivityItem(actorId ?? null, pub.id, pub._previousDataValues)),
);

Pub.beforeDestroy((pub, { actorId }) =>
	defer(() => createPubActivityItem('pub-removed', actorId ?? null, pub.id)),
);
