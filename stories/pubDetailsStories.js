import React from 'react';
import { storiesOf } from '@storybook/react';
import PubDetails from 'components/PubDetails/PubDetails';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };

const collaborators = [
	{
		id: 0,
		slug: 'userslug',
		userInitials: 'TR',
		userAvatar: '/dev/trich.jpg',
		fullName: 'Travis Rich',
		isAuthor: true,
	},
	{
		id: 1,
		slug: 'userslug',
		userInitials: 'MW',
	},
	{
		id: 2,
		slug: 'userslug',
		userInitials: 'TW',
		userAvatar: '/dev/tomer.jpg',
		fullName: 'Tomer Weller',
		isAuthor: true,
	},
	{
		id: 3,
		slug: 'userslug',
		userInitials: 'FF',
		userAvatar: '/dev/danny.jpg',
		fullName: 'Danny Hillis',
		isAuthor: true,
	},
	{
		id: 4,
		slug: 'userslug',
		userInitials: 'WL',
	},
	{
		id: 5,
		slug: 'userslug',
		userInitials: 'PL',
		userAvatar: '/dev/lip.jpg',
	},
];

const pubData = {
	slug: 'myslug',
	numDiscussions: '3',
	numCollaborators: '6',
	numSuggestions: '11',
};

const versions = [
	{
		id: 0,
		date: new Date() - 1000000000,
		active: true,
	},
	{
		id: 1,
		date: new Date() - 2000000000,
	},
	{
		id: 3,
		date: new Date() - 5000000000,
	},
	{
		id: 2,
		date: new Date() - 3000000000,
	},
	
];
storiesOf('Pub Details', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubDetails
				collaborators={collaborators}
				pubData={pubData}
				versions={versions}
			/>
		</div>
	</div>
));
