import React from 'react';
import { storiesOf } from '@storybook/react';
import ContentOverview from 'containers/DashboardOverview/ContentOverview';
import { AccentStyle } from 'components';
import { communityData, overviewData } from 'data';

// require('containers/Dashboard/dashboard.scss');

storiesOf('containers/DashboardOverview/ContentOverview', module).add('default', () => (
	<div id="dashboard-container" style={{ margin: '20px' }}>
		<AccentStyle communityData={communityData} isNavHidden={false} />
		<ContentOverview overviewData={overviewData} />
	</div>
));
