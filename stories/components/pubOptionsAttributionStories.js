import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsAttribution from 'components/PubOptionsAttribution/PubOptionsAttribution';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsAttribution', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsAttribution
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
