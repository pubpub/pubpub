import React from 'react';
import { storiesOf } from '@storybook/react';
import PubDetails from 'components/PubDetails/PubDetails';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

const description = 'A virtual representation of the space of an event and provide tools by which a producer can draw upon images, graphics, data, and live cameras to create a video stream equivalent to a broadcast';

storiesOf('Pub Details', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubDetails
				title={'Soundscapes'}
				description={description}
			/>
		</div>
		<div style={wrapperStyle}>
			<PubDetails
				title={'Soundscapes'}
				description={description}
				backgroundImage={'/dev/pubHeader.png'}
			/>
		</div>
	</div>
));
