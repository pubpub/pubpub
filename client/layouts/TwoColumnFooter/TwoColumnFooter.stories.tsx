import React from 'react';
import { storiesOf } from '@storybook/react';

import TwoColumnFooter from './TwoColumnFooter';
import twoColumnFooterData from './twoColumnFooterData';

storiesOf('components/MinimalHeader', module).add('default', () => (
	<TwoColumnFooter {...twoColumnFooterData} />
));
