import {
	PubReviewCommentAddedActivityItem,
	PubReviewCreatedActivityItem,
	PubReviewUpdatedActivityItem,
} from 'types';
import { getDashUrl } from 'utils/dashboard';

import { TitleRenderer } from '../types';
import { getPubFromContext, getReviewFromContext } from './util';

type AcceptedItem =
	| PubReviewCreatedActivityItem
	| PubReviewCommentAddedActivityItem
	| PubReviewUpdatedActivityItem;

export const titleReview: TitleRenderer<AcceptedItem> = (item, context) => {
	const pubFromContext = getPubFromContext(item.pubId, context);
	const reviewFromContext = getReviewFromContext(item.payload.reviewId, context);

	const href =
		pubFromContext && reviewFromContext
			? getDashUrl({
					pubSlug: pubFromContext.slug,
					mode: 'reviews',
					subMode: String(reviewFromContext.number),
			  })
			: null;

	return { title: 'a Release', href };
};
