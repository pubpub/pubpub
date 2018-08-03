import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsSaveVersion from 'components/PubOptionsSaveVersion/PubOptionsSaveVersion';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components', module)
.add('PubOptionsSaveVersion', () => (
	<div className="pub-options-component" style={{ padding: '20px' }}>
		<div className="right-column">
			<PubOptionsSaveVersion
				pubData={pubData}
				communityData={communityData}
				setPubData={()=>{}}
			/>
		</div>
	</div>
));
