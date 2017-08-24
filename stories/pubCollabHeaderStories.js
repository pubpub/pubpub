import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, accentDataLight, pubData, pubVersions, pubCollaborators } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

const content = (
	<div style={wrapperStyle}>
		<PubCollabHeader
			pubData={pubData}
			collaborators={pubCollaborators}
			activeCollaborators={[pubCollaborators[0], pubCollaborators[2], pubCollaborators[5]]}
		/>
	</div>
);
storiesOf('Pub Collab Header', module)
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
