import { Review } from '../review';

import { ActivityItemBase, Diff } from './util';
import { DiscussionActivityItemBase } from './discussion';
import { ThreadActivityItemBase } from './thread';

type PubActivityItemBase = ActivityItemBase & {
	pubId: string;
	payload: {
		pub: {
			title: string;
		};
	};
};

export type PubCreatedActivityItem = PubActivityItemBase & {
	kind: 'pub-created';
};

export type PubUpdatedActivityItem = PubActivityItemBase & {
	kind: 'pub-updated';
	payload: {
		title?: Diff<string>;
		doi?: Diff<null | string>;
		attributions?: true;
		draft?: true;
	};
};

export type PubRemovedActivityItem = PubActivityItemBase & {
	kind: 'pub-removed';
};

export type PubReleasedActivityItem = PubActivityItemBase & {
	kind: 'pub-released';
	payload: {
		releaseId: string;
	};
};

type PubEdgeActivityItemBase = PubActivityItemBase & {
	payload: {
		pubEdgeId: string;
		target: {
			pub: {
				id: string;
				title: string;
				slug: string;
			};
			externalPublication?: {
				title: string;
				url: string;
			};
		};
	};
};

export type PubEdgeCreatedActivityItem = PubEdgeActivityItemBase & {
	kind: 'pub-edge-created';
};

export type PubEdgeRemovedActivityItem = PubEdgeActivityItemBase & {
	kind: 'pub-edge-removed';
};

type PubDiscussionActivityItemBase = DiscussionActivityItemBase & PubActivityItemBase;

export type PubDiscussionCommentAddedActivityItem = PubDiscussionActivityItemBase & {
	kind: 'pub-discussion-comment-added';
};

type PubReviewActivityItemBase = PubActivityItemBase & { payload: { reviewId: string } };

export type PubReviewCreatedActivityItem = PubReviewActivityItemBase &
	ThreadActivityItemBase & {
		kind: 'pub-review-created';
		payload: {
			userId: string;
		};
	};

export type PubReviewCommentAddedActivityItem = PubReviewActivityItemBase &
	ThreadActivityItemBase & {
		kind: 'pub-review-comment-added';
	};

export type PubReviewUpdatedActivityItem = PubReviewActivityItemBase & {
	kind: 'pub-review-updated';
	payload: {
		status: Diff<Review['status']>;
	};
};

export type PubActivityItem =
	| PubCreatedActivityItem
	| PubUpdatedActivityItem
	| PubRemovedActivityItem
	| PubReleasedActivityItem
	| PubDiscussionCommentAddedActivityItem
	| PubEdgeCreatedActivityItem
	| PubEdgeRemovedActivityItem
	| PubReviewCreatedActivityItem
	| PubReviewCommentAddedActivityItem
	| PubReviewUpdatedActivityItem;
