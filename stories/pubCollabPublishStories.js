import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabPublish from 'components/PubCollabPublish/PubCollabPublish';

storiesOf('PubCollabPublish', module)
.add('Default', () => (
	<div style={{ margin: '1em' }} className={'pt-card pt-elevation-2'}>
		<PubCollabPublish />
	</div>
));
