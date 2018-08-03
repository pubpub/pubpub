import React from 'react';
import { storiesOf } from '@storybook/react';
import Pub from 'containers/Pub/Pub';
import { locationData, loginData, communityData, pubData } from '../data';

storiesOf('Containers', module)
.add('Pub', () => (
	<Pub
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
		pubData={pubData}
	/>
));
