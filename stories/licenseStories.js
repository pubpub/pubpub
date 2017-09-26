import React from 'react';
import { storiesOf } from '@storybook/react';
import License from 'components/License/License';

const wrapperStyle = { margin: '1em' };

storiesOf('License', module)
.add('Default', () => (
	<div style={wrapperStyle}>
		<License />
	</div>
))
