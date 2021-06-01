import React from 'react';

import {
	PubCreatedActivityItem,
	PubUpdatedActivityItem,
	PubRemovedActivityItem,
	PubReleasedActivityItem,
	PubEdgeCreatedActivityItem,
	PubEdgeRemovedActivityItem,
	PubDiscussionCommentAddedActivityItem,
	PubReviewCreatedActivityItem,
	PubReviewCommentAddedActivityItem,
	PubReviewUpdatedActivityItem,
} from 'types';

import { renderItem } from '../renderItem';
import {
	titlePub,
	titlePubEdge,
	titlePubEdgeTarget,
	titleRelease,
	titleReview,
	titleDiscussion,
} from '../titles';

type BaseTitles = 'pub';
type ReleaseTitles = BaseTitles | 'release';
type PubEdgeTitles = BaseTitles | 'target' | 'edge';
type DiscussionTitles = BaseTitles | 'discussion';
type ReviewTitles = BaseTitles | 'review';

export const renderPubCreated = renderItem<PubCreatedActivityItem, BaseTitles>({
	icon: 'pubDoc',
	titles: {
		pub: titlePub,
	},
	message: ({ titles }) => {
		const { actor, pub } = titles;
		return (
			<>
				{actor} created {pub}
			</>
		);
	},
});

export const renderPubUpdated = renderItem<PubUpdatedActivityItem, BaseTitles>({
	icon: 'pubDoc',
	titles: {
		pub: titlePub,
	},
	message: ({ item, titles }) => {
		const { payload } = item;
		const { actor, pub } = titles;
		if (payload.draft) {
			return (
				<>
					{actor} edited {pub}
				</>
			);
		}
		if (payload.doi) {
			return (
				<>
					{actor} set the DOI of {pub} to {payload.doi.to}
				</>
			);
		}
		if (payload.attributions) {
			return (
				<>
					{actor} updated the contributors to {pub}
				</>
			);
		}
		if (payload.title) {
			return (
				<>
					{actor} changed the title of {pub} from {payload.title.from} to{' '}
					{payload.title.to}
				</>
			);
		}
		return (
			<>
				{actor} updated the settings for {pub}
			</>
		);
	},
});

export const renderPubRemoved = renderItem<PubRemovedActivityItem, BaseTitles>({
	icon: 'pubDoc',
	titles: {
		pub: titlePub,
	},
	message: ({ titles }) => {
		const { actor, pub } = titles;
		return (
			<>
				{actor} removed {pub}
			</>
		);
	},
});

export const renderPubReleased = renderItem<PubReleasedActivityItem, ReleaseTitles>({
	icon: 'document-share',
	titles: {
		pub: titlePub,
		release: titleRelease,
	},
	message: ({ titles }) => {
		const { actor, pub, release } = titles;
		return (
			<>
				{actor} created {release} of {pub}
			</>
		);
	},
});

export const renderPubEdgeCreated = renderItem<PubEdgeCreatedActivityItem, PubEdgeTitles>({
	icon: 'layout-auto',
	titles: {
		pub: titlePub,
		edge: titlePubEdge,
		target: titlePubEdgeTarget,
	},
	message: ({ titles }) => {
		const { actor, edge, target, pub } = titles;
		return (
			<>
				{actor} created {edge} with {target} for {pub}
			</>
		);
	},
});

export const renderPubEdgeRemoved = renderItem<PubEdgeRemovedActivityItem, PubEdgeTitles>({
	icon: 'layout-auto',
	titles: {
		pub: titlePub,
		edge: titlePubEdge,
		target: titlePubEdgeTarget,
	},
	message: ({ titles }) => {
		const { actor, edge, target, pub } = titles;
		return (
			<>
				{actor} removed {edge} with {target} from {pub}
			</>
		);
	},
});

export const renderPubDiscussionCommentAdded = renderItem<
	PubDiscussionCommentAddedActivityItem,
	DiscussionTitles
>({
	icon: 'chat',
	titles: {
		pub: titlePub,
		discussion: titleDiscussion,
	},
	message: ({ titles }) => {
		const { actor, pub, discussion } = titles;
		return (
			<>
				{actor} added {discussion} to {pub}
			</>
		);
	},
	excerpt: ({ item }) => {
		return item.payload.threadComment.text;
	},
});

export const renderPubReviewCreated = renderItem<PubReviewCreatedActivityItem, ReviewTitles>({
	icon: 'social-media',
	titles: {
		pub: titlePub,
		review: titleReview,
	},
	message: ({ titles }) => {
		const { actor, pub, review } = titles;
		return (
			<>
				{actor} created {review} on {pub}
			</>
		);
	},
	excerpt: ({ item }) => {
		return item.payload.threadComment.text;
	},
});

export const renderPubReviewCommentAdded = renderItem<
	PubReviewCommentAddedActivityItem,
	ReviewTitles
>({
	icon: 'social-media',
	titles: {
		pub: titlePub,
		review: titleReview,
	},
	message: ({ titles }) => {
		const { actor, pub, review } = titles;
		return (
			<>
				{actor} added a comment to {review} on {pub}
			</>
		);
	},
	excerpt: ({ item }) => {
		return item.payload.threadComment.text;
	},
});

export const renderPubReviewUpdated = renderItem<PubReviewUpdatedActivityItem, ReviewTitles>({
	icon: 'social-media',
	titles: {
		pub: titlePub,
		review: titleReview,
	},
	message: ({ titles, item }) => {
		const { actor, pub, review } = titles;
		const { status } = item.payload;
		if (status) {
			return (
				<>
					{actor} changed the status of {review} on {pub} from <i>{status.from}</i> to{' '}
					<i>{status.to}</i>
				</>
			);
		}
		return (
			<>
				{actor} updated {review} on {pub}
			</>
		);
	},
});
