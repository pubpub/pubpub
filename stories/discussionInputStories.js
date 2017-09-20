import React from 'react';
import { storiesOf } from '@storybook/react';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';
import { nestDiscussionsToThreads } from 'utilities';
import { pubData } from './_data';

const threads = nestDiscussionsToThreads(pubData.discussions);
const wrapperStyle = { backgroundColor: '#F0F0F0', margin: '1em', padding: '2em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)', maxWidth: 500 };

const handleSubmit = (content)=> {
	console.log(content);
};

const initialDoc = {
	type: 'doc',
	attrs: { meta: {} },
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello everyone!'
				}
			]
		}
	]
};

storiesOf('DiscussionInput', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<DiscussionInput
				handleSubmit={handleSubmit}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionInput
				handleSubmit={handleSubmit}
				showTitle={true}
				submitLoading={true}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionInput
				handleSubmit={handleSubmit}
				showTitle={true}
				initialContent={initialDoc}
			/>
		</div>
	</div>
));
