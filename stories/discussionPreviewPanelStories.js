import React from 'react';
import { storiesOf } from '@storybook/react';
import DiscussionPreviewPanel from 'components/DiscussionPreviewPanel/DiscussionPreviewPanel';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, pubData, discussions } from './_data';

const wrapperStyle = { width: '350px', minHeight: 'calc(100vh - 2em)', margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

storiesOf('DiscussionPreviewPanel', module)
.add('Default', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		<div style={wrapperStyle}>
			<DiscussionPreviewPanel
				threads={pubData.discussions}
				slug={'my-article'}
			/>
		</div>
	</div>
));
