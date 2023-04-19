import React from 'react';
import { storiesOf } from '@storybook/react';

import HeaderArcadia from './HeaderArcadia';
import headerArcadiaData from './headerArcadiaData';

storiesOf('components/HeaderArcadia', module).add('default', () => (
	<HeaderArcadia loggedIn {...headerArcadiaData} />
));
