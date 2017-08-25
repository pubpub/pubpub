import React from 'react';
import { storiesOf } from '@storybook/react';
import DashboardCollectionEdit from 'components/DashboardCollectionEdit/DashboardCollectionEdit';
import { collectionData } from './_data'

require('containers/Dashboard/dashboard.scss');
const pageStyle = { padding: '1.5em 2em', maxWidth: '951px' };

storiesOf('DashboardCollectionEdit', module)
.add('Default', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollectionEdit collectionData={collectionData} />
	</div>
));
