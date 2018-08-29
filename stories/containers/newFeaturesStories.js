import React from 'react';
import { storiesOf } from '@storybook/react';
import NewFeatures from 'containers/NewFeatures/NewFeatures';
import { locationData, loginData, communityData } from '../data';

storiesOf('Containers', module)
.add('NewFeatures', () => (
	<NewFeatures
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
