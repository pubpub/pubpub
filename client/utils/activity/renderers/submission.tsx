import React from 'react';

import { SubmissionUpdatedActivityItem } from 'types';

import { pubTitle, collectionTitle } from '../titles';
import { itemRenderer } from './itemRenderer';

type Titles = 'pub' | 'collection';

export const renderSubmissionUpdated = itemRenderer<SubmissionUpdatedActivityItem, Titles>({
	icon: 'manually-entered-data',
	titleRenderers: {
		pub: pubTitle,
		collection: collectionTitle,
	},
	message: ({ titles, item }) => {
		const { payload } = item;
		const { actor, pub, collection } = titles;
		if (payload.status) {
			const { to } = payload.status;
			if (to === 'pending') {
				return (
					<>
						{actor} submitted {pub} to {collection}
					</>
				);
			}
			if (to === 'accepted') {
				return (
					<>
						{actor} accepted {pub} for submission to {collection}
					</>
				);
			}
			if (to === 'declined') {
				return (
					<>
						{actor} denied {pub} for submission to {collection}
					</>
				);
			}
		}
		return (
			<>
				{actor} updated the submission status for {pub} in [collection]
			</>
		);
	},
});
