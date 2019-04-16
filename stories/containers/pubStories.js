import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOld from 'containers/PubOld/PubOld';
import { locationData, loginData, communityData, pubData } from '../data';

storiesOf('Containers/PubOld', module).add('default', () => (
	<PubOld
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
		pubData={pubData}
	/>
));
