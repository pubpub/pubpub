import React from 'react';

import { usePageContext } from 'utils/hooks';

require('./review.scss');

type Props = {
	reviewDocument: string;
};

const Review = (props: Props) => {
	const { reviewDocument } = props;
	const { scopeData } = usePageContext();
	console.log(scopeData);

	return <div>{reviewDocument}</div>;
};

export default Review;
