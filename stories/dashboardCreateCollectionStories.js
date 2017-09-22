import React from 'react';
import { storiesOf } from '@storybook/react';
import DashboardCreateCollection from 'components/DashboardCreateCollection/DashboardCreateCollection';
import { collectionData } from './_data';

const pageStyle = { padding: '1.5em 2em', maxWidth: '951px', border: '1px solid #CCC' };

storiesOf('DashboardCreateCollection', module)
.add('Default', () => (
	<div>
		<div style={pageStyle}>
			<DashboardCreateCollection isPage={true} />
		</div>
		<div style={pageStyle}>
			<DashboardCreateCollection isPage={false} />
		</div>
	</div>
));
