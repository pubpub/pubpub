import React from 'react';
import { storiesOf } from '@storybook/react';
import NewLanding from 'containers/NewLanding/NewLanding';
import { locationData, loginData, communityData } from '../data';

storiesOf('Containers', module)
.add('NewLanding', () => (
	<NewLanding
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
