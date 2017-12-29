import React from 'react';
import { storiesOf } from '@storybook/react';
import Landing from 'containers/Landing/Landing';

require('containers/Landing/landing.scss');

storiesOf('Containers/Landing', module)
.add('Default', () => (
	<Landing />
));
