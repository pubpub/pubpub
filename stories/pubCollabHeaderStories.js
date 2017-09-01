import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, accentDataLight, pubData } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

const content = (
	<div style={wrapperStyle}>
		<PubCollabHeader
			pubData={pubData}
			collaborators={pubData.contributors}
			activeCollaborators={[
				pubData.contributors[0],
				pubData.contributors[1],
				pubData.contributors[2],
			]}
		/>
	</div>
);
storiesOf('PubCollabHeader', module)
.add('Default', () => (
	<div>
		{content}
	</div>
))
.add('Styled Dark', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		{content}
	</div>
))
.add('Styled Light', () => (
	<div>
		<AccentStyle {...accentDataLight} />
		{content}
	</div>
));
