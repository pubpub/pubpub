import React, { useState } from 'react';

import { apiFetch } from 'client/utils/apiFetch';
import { DocJson } from 'types';

import ReviewEditor from './ReviewEditor';
import ReviewModal from './ReviewModal';

type Props = {
	pubData: any;
	updatePubData: (...args: any[]) => any;
	communityData: any;
};

const Review = (props: Props) => {
	const { pubData, updatePubData, communityData } = props;
	const [reviewDoc, setReviewDoc] = useState({} as DocJson);
	const [isLoading, setIsLoading] = useState(false);
	const [createError, setCreateError] = useState(undefined);

	const createReviewDoc = () => {
		setIsLoading(true);
		return apiFetch
			.post('/api/reviews', {
				communityId: communityData.id,
				pubId: pubData.id,
				review: reviewDoc,
				title: 'anonymous',
			})
			.then((review) => {
				setIsLoading(false);
				setCreateError(undefined);
				updatePubData((currentPubData) => {
					return {
						reviews: [...currentPubData.reviews, review],
					};
				});
				window.location.href = `/dash/pub/${pubData.slug}/reviews/${review.number}`;
			})
			.catch((err) => {
				setIsLoading(false);
				setCreateError(err);
			});
	};

	return (
		<div>
			<ReviewEditor setReviewDoc={setReviewDoc} setIsLoading={setIsLoading} />
			<ReviewModal
				createReviewDoc={createReviewDoc}
				isLoading={isLoading}
				createError={createError}
				pubData={pubData}
				updatePubData={updatePubData}
			/>
		</div>
	);
};

export default Review;
