import React from 'react';

import { ActivityItemsContext, ActivityAssociations, WithId, ActivityItem } from 'types';
import { communityUrl, pubUrl } from 'utils/canonicalUrls';
import { getDashUrl } from 'utils/dashboard';
import { itemTitlers } from './titles';

type Renderer<Item, Titles> = (
	item: Item,
	titles: Titles,
	context: ActivityItemsContext,
) => React.ReactNode;

type Renderers = {
	[K in ActivityItem['kind']]: Renderer<
		ActivityItem & { kind: K },
		ReturnType<typeof itemTitlers[K]>
	>;
};

const renderers: Renderers = {
	'community-created': (item, { community }) => titled`created the community ${community}`,
};
