import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabDetails from 'components/PubCollabDetails/PubCollabDetails';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark } from './_data';

const handleDetailsSave = (details)=> {
	console.log(details);
};
const wrapperStyle = { margin: '1em' };

storiesOf('PubCollabDetails', module)
.add('Default', () => (
	<div>
		<div className={'pt-card pt-elevation-2'} style={wrapperStyle}>
			<AccentStyle {...accentDataDark} />
			<PubCollabDetails
				pubData={{
					title: 'My Title',
					slug: 'snails',
				}}
				onSave={handleDetailsSave}
			/>
		</div>
	</div>
));
