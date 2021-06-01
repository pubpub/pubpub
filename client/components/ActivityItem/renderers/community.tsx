import React from 'react';

import { CommunityCreatedActivityItem, CommunityUpdatedActivityItem } from 'types';

import { renderItem } from '../renderItem';
import { titleCommunity } from '../titles';

type Titles = 'community';

export const renderCommunityCreated = renderItem<CommunityCreatedActivityItem, Titles>({
	icon: 'office',
	titles: {
		community: titleCommunity,
	},
	message: ({ titles }) => {
		const { actor, community } = titles;
		return (
			<>
				{actor} created {community}
			</>
		);
	},
});

export const renderCommunityUpdated = renderItem<CommunityUpdatedActivityItem, Titles>({
	icon: 'office',
	titles: {
		community: titleCommunity,
	},
	message: ({ titles, item }) => {
		const { actor, community } = titles;
		if (item.payload.title) {
			const { from, to } = item.payload.title;
			return (
				<>
					{actor} changed the title of {community} from <i>{from}</i> to <i>{to}</i>
				</>
			);
		}
		return (
			<>
				{actor} updated the settings for {community}
			</>
		);
	},
});
