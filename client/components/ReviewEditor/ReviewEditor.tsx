import React, { useState } from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';

import { MinimalEditor } from 'components';
import { apiFetch } from 'client/utils/apiFetch';
import { DocJson } from 'types';

require('./reviewEditor.scss');

type Props = {
	pubData: any;
	updatePubData: (...args: any[]) => any;
	communityData: any;
};

const ReviewEditor = (props: Props) => {
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

	const updatingReviewDoc = (doc: DocJson) => {
		setIsLoading(true);
		setReviewDoc(doc);
		setTimeout(() => {
			setIsLoading(false);
		}, 300);
	};
	return (
		<div className="review-editor">
			<div className="review-editor-component">
				<MinimalEditor
					getButtons={(buttons) => buttons.reviewButtonSet}
					onEdit={(doc) => updatingReviewDoc(doc.toJSON() as DocJson)}
					debounceEditsMs={300}
					useFormattingBar
					focusOnLoad={true}
				/>
			</div>
			<Button onClick={createReviewDoc} loading={isLoading}>
				This button kinda lit
			</Button>
			{createError && (
				<NonIdealState
					title="Something something errors"
					// @ts-expect-error ts-migrate(2322) FIXME: Type '{ title: string; visual: string; action: Ele... Remove this comment to see the full error message
					visual="error"
					action={
						<a href="/login?redirect=/community/create" className="bp3-button">
							Login or Signup
						</a>
					}
				/>
			)}
		</div>
	);
};

export default ReviewEditor;
