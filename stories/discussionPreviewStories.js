import React from 'react';
import { storiesOf } from '@storybook/react';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import { discussions } from './_data';

const wrapperStyle = { margin: '1em', padding: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

storiesOf('DiscussionPreview', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<DiscussionPreview
				discussions={discussions[0]}
			/>
		</div>
		<div style={wrapperStyle}>
			<DiscussionPreview
				discussions={discussions[1]}
			/>
		</div>
	</div>
));
