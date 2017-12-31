import React from 'react';
import { storiesOf } from '@storybook/react';
import NoMatch from 'containers/NoMatch/NoMatch';
import { initialData } from '../data';

require('containers/NoMatch/noMatch.scss');

storiesOf('Containers/NoMatch', module)
.add('Default', () => (
	<NoMatch {...initialData} />
));
