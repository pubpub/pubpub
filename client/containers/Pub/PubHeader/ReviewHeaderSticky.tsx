import React, { useState } from 'react';
import { Button } from '@blueprintjs/core';

import { usePageContext } from 'utils/hooks';
import { Icon } from 'components';
import { apiFetch } from 'client/utils/apiFetch';
import { useLocalStorage } from 'client/utils/useLocalStorage';
import { getEmptyDoc } from 'client/components/Editor';
import { DocJson } from 'types';

import { usePubContext } from '../pubHooks';
import Review from './Review/Review';
import ReviewerDialog from './Review/ReviewerDialog';

require('./reviewHeaderSticky.scss');

const ReviewHeaderSticky = () => {
	const { pubData, updatePubData } = usePubContext();
	const {
		communityData,
		scopeData: { activePermissions, memberData },
		loginData: { fullName },
	} = usePageContext();

	const [visible, setVisible] = useState(false);
	const [reviewTitle, setReviewTitle] = useState('Untitled Review');
	const [reviewerName, setReviewerName] = useState('');
	const [createError, setCreateError] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [createdReview, setCreatedReview] = useState(false);
	const [showReview, setShowReview] = useState(false);

	// creates a docjoson object in local store, provides state handlers as well
	const { value: review, setValue: setReview } = useLocalStorage<DocJson>({
		initial: () => getEmptyDoc(),
		communityId: communityData.id,
		featureName: 'new-review-editor',
		path: [`pub-${pubData.id}`],
		debounce: 100,
	});

	const updatingReviewDoc = (doc: DocJson) => {
		setReview(doc);
	};

	const url = new URL(window.location.href);
	const query = new URLSearchParams(url.search);
	const handleSubmit = () => {
		setIsLoading(true);
		apiFetch
			.post('/api/reviews', {
				communityId: communityData.id,
				pubId: pubData.id,
				reviewContent: review,
				title: reviewTitle,
				accessHash: query.get('access'),
				reviewerName,
			})
			.then((reviewRes) => {
				updatePubData((currentPubData) => {
					return currentPubData.reviews
						? {
								reviews: [...currentPubData.reviews, reviewRes],
						  }
						: {
								reviews: [reviewRes],
						  };
				});
				setIsLoading(false);
				setReview(getEmptyDoc());
				setCreateError(undefined);

				setCreatedReview(true);
			})
			.catch((err) => {
				setIsLoading(false);
				setCreateError(err);
			});
	};

	const renderReview = () => (
		<Review
			communityData={communityData}
			onSubmit={() => setVisible(true)}
			isLoading={isLoading}
			review={review}
			updateReview={updatingReviewDoc}
		/>
	);

	return (
		<div className="review-header-sticky-component container pub">
			<div className="sticky-section">
				<div className="sticky-title">{pubData.title}</div>
				<div className="side-content">
					{showReview && renderReview()}
					<div className="sticky-buttons">
						<div className="sticky-review-text">review</div>
						<ReviewerDialog
							isOpen={visible}
							onClose={() => setVisible(false)}
							pubData={pubData}
							onCreateReviewDoc={handleSubmit}
							setReviewTitle={setReviewTitle}
							reviewTitle={reviewTitle}
							reviewerName={reviewerName}
							setReviewerName={setReviewerName}
							createdReview={createdReview}
							createError={createError}
							activePermissions={activePermissions}
							fullName={fullName}
							memberData={memberData}
						/>

						<Button
							minimal={true}
							icon={<Icon icon="expand-all" />}
							onClick={() => setShowReview(!showReview)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReviewHeaderSticky;
