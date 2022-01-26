import React from 'react';
import { storiesOf } from '@storybook/react';

import PubSubmissionHeader from './PubSubmissionHeader';
// import { locationData, loginData, communityData } from 'utils/storybook/data';

storiesOf('containers/Pub/PubSubmissionHeader', module).add('default', () => (
	<PubSubmissionHeader />
));
