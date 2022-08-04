import React from 'react';
import { Button } from '@blueprintjs/core';

import { usePageContext } from 'utils/hooks';
import { ClientOnly, Icon, Popover } from 'components';

import { usePubContext } from '../pubHooks';
import Review from './Review/Review';

require('./reviewHeaderSticky.scss');

const ReviewHeaderSticky = () => {
	const { pubData, updatePubData } = usePubContext();
	const { communityData } = usePageContext();

	return (
		<div className="review-header-sticky-component">
			<div className="sticky-grid">
				<div className="sticky-title main-content">{pubData.title}</div>
				<div className="side-content">
					<div className="sticky-buttons sticky-review-buttons">
						<div className="sticky-review-text">review</div>

						<Popover
							aria-label="Notifications"
							placement="bottom-start"
							className="review-popover"
							content={
								<ClientOnly>
									<Review
										pubData={pubData}
										updatePubData={updatePubData}
										communityData={communityData}
									/>
								</ClientOnly>
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
