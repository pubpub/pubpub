import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsSharing from 'components/PubOptionsSharing/PubOptionsSharing';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsSharing', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsSharing
				pubData={pubData}
				communityData={communityData}
				setPubdat={()=>{}}
				canManage={true}
			/>
		</div>
	</div>
));
