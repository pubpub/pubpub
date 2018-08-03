import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsSaveVersion from 'components/PubOptionsSaveVersion/PubOptionsSaveVersion';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsSaveVersion', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsSaveVersion
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
