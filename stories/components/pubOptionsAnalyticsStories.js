import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsAnalytics from 'components/PubOptionsAnalytics/PubOptionsAnalytics';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components', module)
.add('PubOptionsAnalytics', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsAnalytics
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
