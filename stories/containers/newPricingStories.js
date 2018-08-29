import React from 'react';
import { storiesOf } from '@storybook/react';
import NewPricing from 'containers/NewPricing/NewPricing';
import { locationData, loginData, communityData } from '../data';

storiesOf('Containers', module)
.add('NewPricing', () => (
	<NewPricing
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
