import React, { useMemo, useState } from 'react';
import { NonIdealState, Button, Card, Elevation } from '@blueprintjs/core';
import Color from 'color';

import { useSticky } from 'client/utils/useSticky';
import { DocJson, Community } from 'types';

import ReviewEditor from './ReviewEditor';

require('./review.scss');

type Props = {
	communityData: Community;
	onSubmit: any;
	isLoading: boolean;
	createError: boolean;
	review: DocJson;
	updateReview: (doc: DocJson) => void;
};

const Review = (props: Props) => {
	const { communityData, onSubmit, isLoading, createError, review, updateReview } = props;

	useSticky({
		target: '.review-component',
		isActive: true,
		offset: 37,
	});

	const [hover, setHover] = useState(false);
	const lighterAccentColor = useMemo(
		() => Color(communityData.accentColorDark).alpha(0.4),
		[communityData.accentColorDark],
	);
	const bgColor = !hover ? lighterAccentColor : communityData.accentColorDark;

	return (
		<Card interactive={true} elevation={Elevation.TWO}>
			<div className="review-component">
				<div className="review-border">
					<ReviewEditor setReviewDoc={updateReview} reviewDoc={review} />
				</div>
				<div className="review-button">
					<Button
						icon="document-share"
						onClick={onSubmit}
						minimal={true}
						loading={isLoading}
						className="review-submission-button"
						style={{ background: bgColor }}
						intent="primary"
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
					>
						Submit Review
					</Button>

					{createError && (
						<NonIdealState
							title="There was an error submitting your review"
							// @ts-expect-error ts-migrate(2322) FIXME: Type '{ title: string; visual: string; action: Ele... Remove this comment to see the full error message
							visual="error"
							action={
								<a href="/login" className="bp3-button">
									Login or Signup
								</a>
							}
						/>
					)}
				</div>
			</div>
		</Card>
	);
};

export default Review;
