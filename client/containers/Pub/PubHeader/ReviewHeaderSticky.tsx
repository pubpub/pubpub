import React, { useState } from 'react';
import { Button } from '@blueprintjs/core';

import { usePageContext } from 'utils/hooks';
import { Icon, Popover } from 'components';
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
		scopeData: { activePermissions },
		loginData: { fullName },
	} = usePageContext();

	const [visible, setVisible] = useState(false);
	const [reviewTitle, setReviewTitle] = useState('Untitled Review');
	const [reviewerName, setReviewerName] = useState('');
	const [createError, setCreateError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [createdReview, setCreatedReview] = useState(false);

	const isUser = !!(activePermissions.canEdit || fullName);

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
				setIsLoading(false);
				setReview(getEmptyDoc());
				setCreatedReview(true);
				updatePubData((currentPubData) => {
					return currentPubData.reviews
						? {
								reviews: [...currentPubData.reviews, reviewRes],
						  }
						: {
								reviews: [reviewRes],
						  };
				});
			})
			.catch((err) => {
				setIsLoading(false);
				setCreateError(err);
			});
	};

	return (
		<div className="review-header-sticky-component">
			<div className="sticky-grid">
				<div className="sticky-title main-content">{pubData.title}</div>
				<div className="side-content">
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
							isUser={isUser}
							createdReview={createdReview}
						/>
						<Popover
							aria-label="Notifications"
							placement="bottom-end"
							className="review-popover"
							content={
								<Review
									communityData={communityData}
									onSubmit={() => setVisible(true)}
									isLoading={isLoading}
									createError={createError}
									review={review}
									updateReview={updatingReviewDoc}
								/>
							}
							preventBodyScroll={false}
							unstable_fixed
						>
							<Button minimal={true} icon={<Icon icon="expand-all" />} />
						</Popover>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReviewHeaderSticky;
