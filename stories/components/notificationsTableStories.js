import React from 'react';
import { storiesOf } from '@storybook/react';
import NotificationsTable from 'components/NotificationsTable/NotificationsTable';
import { notificationsData } from '../data';

const wrapperStyle = { margin: '1em' };
storiesOf('Components', module)
.add('NotificationsTable', () => (
	<div>
		<div style={wrapperStyle}>
			<NotificationsTable resultsData={notificationsData} />
		</div>
	</div>
));