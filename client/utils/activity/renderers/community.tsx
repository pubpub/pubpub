import React from 'react';

import { CommunityCreatedActivityItem, CommunityUpdatedActivityItem } from 'types';

import { titleCommunity } from '../titles';
import { itemRenderer } from './itemRenderer';

type Titles = 'community';

export const renderCommunityCreated = itemRenderer<CommunityCreatedActivityItem, Titles>({
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

export const renderCommunityUpdated = itemRenderer<CommunityUpdatedActivityItem, Titles>({
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
