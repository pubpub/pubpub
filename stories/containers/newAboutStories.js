import React from 'react';
import { storiesOf } from '@storybook/react';
import NewAbout from 'containers/NewAbout/NewAbout';
import { locationData, loginData, communityData } from '../data';

storiesOf('Containers', module)
.add('NewAbout', () => (
	<NewAbout
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
