import React from 'react';
import { Button } from '@blueprintjs/core';

import { Icon } from 'components';

import { usePubContext } from '../../pubHooks';

require('./reviewHeaderSticky.scss');

const ReviewHeaderSticky = () => {
	const { pubData } = usePubContext();

	return (
		<div className="review-header-sticky-component">
			<div className="sticky-grid">
				<div className="sticky-title main-content">{pubData.title}</div>
				<div className="side-content">
					<div className="sticky-buttons sticky-review-buttons">
						<div className="sticky-review-text">review</div>
						<Button
							minimal={true}
							onClick={() => window.scrollTo({ left: 0, top: 0, behavior: 'auto' })}
							icon={<Icon icon="expand-all" />}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReviewHeaderSticky;
