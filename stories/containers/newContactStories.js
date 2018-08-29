import React from 'react';
import { storiesOf } from '@storybook/react';
import NewContact from 'containers/NewContact/NewContact';
import { locationData, loginData, communityData } from '../data';

storiesOf('Containers', module)
.add('NewContact', () => (
	<NewContact
		locationData={locationData}
		loginData={loginData}
		communityData={communityData}
	/>
));
