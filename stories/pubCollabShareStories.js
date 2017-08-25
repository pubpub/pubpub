import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';

storiesOf('PubCollabShare', module)
.add('Default', () => (
	<div style={{ margin: '1em' }} className={'pt-card pt-elevation-2'}>
		<PubCollabShare />
	</div>
));
