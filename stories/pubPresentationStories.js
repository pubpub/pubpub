import React from 'react';
import { storiesOf } from '@storybook/react';
import PubDetails from 'components/PubDetails/PubDetails';
import PubHeader from 'components/PubHeader/PubHeader';
import PubBody from 'components/PubBody/PubBody';
import PubPresentation from 'containers/PubPresentation/PubPresentation';
import AccentStyle from 'components/AccentStyle/AccentStyle';

import { accentDataDark, accentDataLight, pubData, pubVersions, pubCollaborators, pubBody } from './_data';

const wrapperStyle = {
	width: 'calc(50% - 2em)',
	margin: '1em',
	boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)',
	float: 'left',
};

const content = (
	<div className={'pub-presentation'}>
		<div style={wrapperStyle}>
			<PubHeader
				title={'Soundscapes'}
				description={pubData.description}
				backgroundImage={'/dev/pubHeader3.jpg'}
			/>
			<PubDetails
				collaborators={pubCollaborators}
				pubData={pubData}
				versions={pubVersions}
			/>
			<PubBody content={pubBody} />
		</div>
		<div style={wrapperStyle}>
			<PubHeader
				title={'Soundscapes'}
				description={pubData.description}
			/>
			<PubDetails
				collaborators={pubCollaborators}
				pubData={pubData}
				versions={pubVersions}
			/>
			<PubBody content={pubBody} />
		</div>
	</div>
);
storiesOf('Pub Presentation', module)
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
