import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsExport from 'components/PubOptionsExport/PubOptionsExport';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsExport', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsExport
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
