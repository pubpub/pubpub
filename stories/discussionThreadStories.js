import React from 'react';
import { storiesOf } from '@storybook/react';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import { nestDiscussionsToThreads } from 'utilities';
import { pubData } from './_data';

const threads = nestDiscussionsToThreads(pubData.discussions);
const wrapperStyle = { width: 'calc(100% - 2em)', maxWidth: '350px', margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)', float: 'left', };

storiesOf('DiscussionThread', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<DiscussionThread
				discussions={threads[0]}
				slug={'my-article'}
				pathname={'/pub/blah/collaborate'}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionThread
				discussions={threads[1]}
				slug={'my-article'}
				loginData={{
					id: threads[1][0].userId
				}}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionThread
				discussions={threads[0]}
				slug={'my-article'}
				loginData={{
					id: threads[0][1].userId
				}}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionThread
				discussions={threads[1]}
				slug={'my-article'}
				loginData={{
					id: '12312412',
					canAdmin: true
				}}
			/>
		</div>
	</div>
));
