import React from 'react';
import { storiesOf } from '@storybook/react';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';
import { nestDiscussionsToThreads } from 'utilities';
import { pubData } from './_data';

const threads = nestDiscussionsToThreads(pubData.discussions);
const wrapperStyle = { margin: '1em', padding: '2em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)', maxWidth: 500 };

const handleReplySubmit = (content)=> {
	console.log(content);
}

storiesOf('DiscussionInput', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<DiscussionInput
				handleReplySubmit={handleReplySubmit}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionInput
				handleReplySubmit={handleReplySubmit}
				showTitle={true}
			/>
		</div>
	</div>
));
