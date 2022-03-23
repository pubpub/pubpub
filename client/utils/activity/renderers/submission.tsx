import React from 'react';

import { SubmissionCreatedActivityItem, SubmissionStatusUpdatedActivityItem } from 'types';

import { submissionTitle } from '../titles';
import { itemRenderer } from './itemRenderer';

type Titles = 'submission';

export const renderSubmissionCreated = itemRenderer<SubmissionCreatedActivityItem, Titles>({
	icon: 'office',
	titleRenderers: {
		submission: submissionTitle,
	},
	message: ({ titles }) => {
		const { actor, submission } = titles;
		return (
			<>
				{actor} created {submission}
			</>
		);
	},
});

export const renderSubmissionUpdated = itemRenderer<SubmissionStatusUpdatedActivityItem, Titles>({
	icon: 'office',
	titleRenderers: {
		submission: submissionTitle,
	},
	message: ({ titles, item }) => {
		const { payload } = item;
		const { actor, submission } = titles;
		if (payload.status) {
			const { from, to } = payload.status;
			return (
				<>
					{actor} changed the status of {submission} from {from} to {to}
				</>
			);
		}
		return (
			<>
				{actor} updated the settings for {submission}
			</>
		);
	},
});
