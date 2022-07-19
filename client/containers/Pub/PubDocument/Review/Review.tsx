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
	const {
		scopeData,
		loginData: { fullName },
	} = usePageContext();
	const { canManage } = scopeData.activePermissions;
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
				canManage={canManage}
				name={fullName}
			/>
		</div>
	);
};

export default Review;
