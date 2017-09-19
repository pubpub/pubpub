import React from 'react';
import { storiesOf } from '@storybook/react';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import { nestDiscussionsToThreads } from 'utilities';
import { pubData } from './_data';

const threads = nestDiscussionsToThreads(pubData.discussions);
const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

storiesOf('DiscussionPreview', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<DiscussionPreview
				discussions={threads[0]}
				slug={'my-article'}
			/>

		</div>
		<div style={wrapperStyle}>
			<DiscussionPreview
				discussions={threads[1]}
				slug={'my-article'}
			/>
			<DiscussionPreview
				discussions={threads[0]}
				slug={'my-article'}
			/>
			<DiscussionPreview
				discussions={threads[1]}
				slug={'my-article'}
			/>
			<DiscussionPreview
				discussions={threads[0]}
				slug={'my-article'}
			/>
		</div>
	</div>
));
