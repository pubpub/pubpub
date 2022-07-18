import React, { useState } from 'react';

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

	return (
		<div>
			<ReviewEditor setReviewDoc={setReviewDoc} setIsLoading={setIsLoading} />
			<ReviewModal
				isLoading={isLoading}
				pubData={pubData}
				communityData={communityData}
				updatePubData={updatePubData}
				reviewDoc={reviewDoc}
				setIsLoading={setIsLoading}
			/>
		</div>
	);
};

export default Review;
