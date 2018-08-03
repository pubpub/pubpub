import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsSharing from 'components/PubOptionsSharing/PubOptionsSharing';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components', module)
.add('PubOptionsSharing', () => (
	<div className="pub-options-component" style={{ padding: '20px' }}>
		<div className="right-column">
			<PubOptionsSharing
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
