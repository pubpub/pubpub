import React from 'react';

import { usePageContext } from 'utils/hooks';

require('./review.scss');

type Props = {
	reviewDocument: string;
};

const Review = (props: Props) => {
	const { reviewDocument } = props;
	const {
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();

	return (
		<div>
			{reviewDocument}
			{canManage}
		</div>
	);
};

export default Review;
