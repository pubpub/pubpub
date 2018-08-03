import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsVersions from 'components/PubOptionsVersions/PubOptionsVersions';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsVersions', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsVersions
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
