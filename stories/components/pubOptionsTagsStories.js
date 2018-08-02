import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsTags from 'components/PubOptionsTags/PubOptionsTags';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsTags', module)
.add('Default', () => (
	<div className="pub-options-component">
		<div className="container right-column">
			<PubOptionsTags
				pubData={pubData}
				communityData={communityData}
				setPubdat={()=>{}}
				canManage={true}
			/>
		</div>
	</div>
));
