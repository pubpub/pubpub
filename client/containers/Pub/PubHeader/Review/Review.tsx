import React, { useMemo, useState } from 'react';
import { Button, Card, Elevation } from '@blueprintjs/core';
import Color from 'color';

import { useSticky } from 'client/utils/useSticky';
import { DocJson, Community } from 'types';

import ReviewEditor from './ReviewEditor';

require('./review.scss');

type Props = {
	communityData: Community;
	onSubmit: any;
	isLoading: boolean;
	review: DocJson;
	updateReview: (doc: DocJson) => void;
};

const Review = (props: Props) => {
	const { communityData, onSubmit, isLoading, review, updateReview } = props;

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
				</div>
			</div>
		</Card>
	);
};

export default Review;
