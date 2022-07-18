import React, { useState } from 'react';

import { DocJson } from 'types';
import { usePageContext } from 'utils/hooks';

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
	const { scopeData } = usePageContext();
	const { canManage } = scopeData.activePermissions;

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
				canManage={canManage}
			/>
		</div>
	);
};

export default Review;
