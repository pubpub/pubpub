import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabCollections from 'components/PubCollabCollections/PubCollabCollections';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { communityData, pubData, accentDataDark } from './_data';

const handleDetailsSave = (details)=> {
	console.log(details);
};
const wrapperStyle = { margin: '1em' };

storiesOf('PubCollabCollections', module)
.add('Default', () => (
	<div>
		<div className={'pt-card pt-elevation-2'} style={wrapperStyle}>
			<AccentStyle {...accentDataDark} />
			<PubCollabCollections
				pubData={pubData}
				collections={communityData.collections}
				onSave={handleDetailsSave}
			/>
		</div>
	</div>
));
