import React from 'react';
import { storiesOf } from '@storybook/react';
import Pricing from 'containers/Pricing/Pricing';
import { locationData, loginData, communityData } from '../data';

storiesOf('Containers', module)
.add('Pricing', () => (
	<Pricing
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
