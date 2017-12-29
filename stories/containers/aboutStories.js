import React from 'react';
import { storiesOf } from '@storybook/react';
import About from 'containers/About/About';

require('containers/About/about.scss');

storiesOf('Containers/About', module)
.add('Default', () => (
	<About text="Hello" />
));
