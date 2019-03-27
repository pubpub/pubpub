import React from 'react';
import { storiesOf } from '@storybook/react';
import PubOptionsDoiView from 'components/PubOptionsDoi/PubOptionsDoiView';
import { pubData, communityData } from '../data';

require('components/PubOptions/pubOptions.scss');

storiesOf('Components/PubOptionsDoiView', module).add('default', () => (
	<div className="pub-options-component" style={{ padding: '20px' }}>
		<div className="right-column">
			<PubOptionsDoiView pubData={pubData} communityData={communityData} />
		</div>
	</div>
));
