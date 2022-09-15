import React from 'react';
import { storiesOf } from '@storybook/react';

import Landing from 'containers/Landing/Landing';
import { landingPageFeaturedItemsData } from 'utils/storybook/data';

storiesOf('containers/Landing', module).add('default', () => (
	<Landing featuredItems={landingPageFeaturedItemsData as any} />
));
