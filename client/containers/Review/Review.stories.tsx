import React from 'react';
import { storiesOf } from '@storybook/react';

import Review from 'containers/Review/Review';
import { AccentStyle } from 'components';
import { communityData } from 'utils/storybook/data';

// import { reviewData } from './data';

require('containers/DashboardReview/dashboardReview.scss');

storiesOf('containers/Review', module).add('default', () => (
	<div id="dashboard-container">
		<AccentStyle communityData={communityData} isNavHidden={false} />

		<div style={{ padding: '20px', maxWidth: '1240px' }}>
			<Review reviewDocument="reviewData" />
		</div>
	</div>
));
