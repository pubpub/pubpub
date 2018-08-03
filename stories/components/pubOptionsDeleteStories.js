import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsDelete from 'components/PubOptionsDelete/PubOptionsDelete';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components', module)
.add('PubOptionsDelete', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsDelete
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
