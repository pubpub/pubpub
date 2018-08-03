import React from 'react';
import { storiesOf } from '@storybook/react';
import PubDraftHeader from 'components/PubDraftHeader/PubDraftHeader';
import { pubData, locationData } from '../data';

storiesOf('Components', module)
.add('PubDraftHeader', () => (
	<div className="container">
		<PubDraftHeader
			pubData={pubData}
			locationData={locationData}
			setOverlayPanel={()=>{}}
		/>
	</div>
));
