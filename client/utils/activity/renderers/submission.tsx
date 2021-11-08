import React from 'react';

import {
	SubmissionCreatedActivityItem,
	SubmissionDeletedActivityItem,
	SubmissionStatusChangedActivityItem,
} from 'types';

import { pubTitle, submissionTitle } from '../titles';
import { itemRenderer } from './itemRenderer';

type Titles = 'submission' | 'pub';

export const renderSubmissionCreated = itemRenderer<SubmissionCreatedActivityItem, Titles>({
	icon: 'social-media',
	titleRenderers: {
		pub: pubTitle,
		submission: submissionTitle,
	},
	message: ({ titles }) => {
		const { actor, pub, submission } = titles;
		return (
			<>
				{actor} began {submission} for {pub}
			</>
		);
	},
});

export const renderSubmissionStatusChanged = itemRenderer<
	SubmissionStatusChangedActivityItem,
	Titles
>({
	icon: 'social-media',
	titleRenderers: {
		pub: pubTitle,
		submission: submissionTitle,
	},
	message: ({ item, titles }) => {
		const { payload } = item;
		const { actor, pub, submission } = titles;
		const { from, to } = payload.status!;
		return (
			<>
				{actor} changed the status of {submission} for {pub} from <i>{from}</i> to{' '}
				<i>{to}</i>
			</>
		);
	},
});

export const renderSubmissionDeleted = itemRenderer<SubmissionDeletedActivityItem, Titles>({
	icon: 'social-media',
	titleRenderers: {
		submission: submissionTitle,
		pub: pubTitle,
	},
	message: ({ titles }) => {
		const { actor, pub, submission } = titles;
		return (
			<>
				{actor} deleted {submission} for {pub}
			</>
		);
	},
});
