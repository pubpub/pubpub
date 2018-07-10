import React from 'react';
import { storiesOf } from '@storybook/react';
import Login from 'containers/Login/Login';
import { locationData, loginData, communityData } from '../data';

require('containers/Login/login.scss');

storiesOf('Containers/Login', module)
.add('Default', () => (
	<Login
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
