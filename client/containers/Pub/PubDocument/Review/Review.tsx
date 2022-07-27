import React, { useState } from 'react';

import { ClientOnly } from 'components';
import { DocJson, PubPageData, Community } from 'types';

import ReviewEditor from './ReviewEditor';
import ReviewModal from './ReviewModal';

type Props = {
	pubData: PubPageData;
	updatePubData: (...args: any[]) => any;
	communityData: Community;
};

const Review = (props: Props) => {
	const { pubData, updatePubData, communityData } = props;

	const [reviewDoc, setReviewDoc] = useState({} as DocJson);
	const [isLoading, setIsLoading] = useState(false);
	return (
		<div>
			<ClientOnly>
				<ReviewEditor
					setReviewDoc={setReviewDoc}
					communityData={communityData}
					pubData={pubData}
				/>
			</ClientOnly>
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
