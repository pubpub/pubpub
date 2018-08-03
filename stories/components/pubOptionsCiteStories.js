import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsCite from 'components/PubOptionsCite/PubOptionsCite';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsCite', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsCite
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
