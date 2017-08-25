import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

const description = 'A virtual representation of the space of an event and provide tools by which a producer can draw upon images, graphics, data, and live cameras to create a video stream equivalent to a broadcast';

storiesOf('PubPresHeader', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubPresHeader
				title={'Soundscapes'}
				description={description}
			/>
		</div>
		<div style={wrapperStyle}>
			<PubPresHeader
				title={'Soundscapes'}
				description={description}
				backgroundImage={'/dev/pubHeader.png'}
			/>
		</div>
		<div style={wrapperStyle}>
			<PubPresHeader
				title={'A Long Title is the Best Way to Ensure a Maximum Obseletion of Cardiovascular Epistimology Efforts from the 13th Decade Modernist Movement'}
				description={description}
				backgroundImage={'/dev/pubHeader3.jpg'}
			/>
		</div>
		<div style={wrapperStyle}>
			<PubPresHeader
				title={'Soundscapes'}
				backgroundImage={'/dev/pubHeader2.png'}
			/>
		</div>
	</div>
));
