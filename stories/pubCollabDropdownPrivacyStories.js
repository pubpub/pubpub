import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';

storiesOf('PubCollabDropdownPrivacy', module)
.add('Default', () => (
	<div style={{ margin: '1em' }}>
		<PubCollabDropdownPrivacy />
	</div>
));
