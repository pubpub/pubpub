import React from 'react';
import { storiesOf } from '@storybook/react';
import DashboardCollection from 'components/DashboardCollection/DashboardCollection';
import { collectionData } from './_data';

require('containers/Dashboard/dashboard.scss');

const pageStyle = { padding: '1.5em 2em', maxWidth: '951px' };

storiesOf('DashboardCollection', module)
.add('Default', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={collectionData} />
	</div>
));
