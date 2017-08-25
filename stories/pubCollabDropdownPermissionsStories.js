import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';

storiesOf('PubCollabDropdownPermissions', module)
.add('Default', () => (
	<div style={{ margin: '1em' }}>
		<PubCollabDropdownPermissions />
	</div>
));
