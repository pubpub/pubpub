import React from 'react';
import { storiesOf } from '@storybook/react';
import DashboardSide from 'components/DashboardSide/DashboardSide';

const storyStyle = {
	float: 'left',
	margin: '1em',
};
const wrapperStyle = {
	height: 500,
	width: 250,
	boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.6)',
};
const titleStyle = { marginBottom: '2px' };

const pages = [
	{
		title: 'About',
		slug: 'about',
		isPublic: true,
		id: 0,
	},
	{
		title: 'Guidelines',
		slug: 'guidelines',
		isPublic: true,
		id: 1,
	},
	{
		title: 'Pending Authors',
		slug: 'pending',
		isPublic: false,
		id: 2,
	}
];

const collections = [
	{
		title: 'Home',
		slug: 'home',
		isPublic: true,
		id: 3,
	},
	{
		title: 'Sensors',
		slug: 'sensors',
		isPublic: true,
		id: 4,
	},
	{
		title: 'Blockchain',
		slug: 'blockchain',
		isPublic: true,
		id: 5,
	},
	{
		title: 'Meeting Notes',
		slug: 'meeting-notes',
		isPublic: false,
		id: 6,
	},
	{
		title: 'Issue 2017',
		slug: '2017',
		isPublic: true,
		id: 7,
	},
	{
		title: 'Issue 2016',
		slug: '2016',
		isPublic: true,
		id: 8,
	},
	{
		title: 'Issue 2015',
		slug: '2015',
		isPublic: true,
		id: 9,
	},
	{
		title: 'Private Submissions',
		slug: 'private-submissions',
		isPublic: false,
		id: 10,
	},
	{
		title: 'Ideas',
		slug: 'ideas',
		isPublic: false,
		id: 11,
	},
	{
		title: 'Fresh Content',
		slug: 'fresh-content',
		isPublic: false,
		id: 12,
	},
];

storiesOf('DashboardSide', module)
.add('Default', () => (
	<div>
		<div style={storyStyle}>
			<h4 style={titleStyle}>Simple</h4>
			<div style={wrapperStyle}>
				<DashboardSide pages={pages} collections={[...collections].slice(0, 4)} activeSlug={'activity'} />
			</div>
		</div>

		<div style={storyStyle}>
			<h4 style={titleStyle}>No Pages</h4>
			<div style={wrapperStyle}>
				<DashboardSide pages={[]} collections={[...collections].slice(0, 4)} />
			</div>
		</div>
		<div style={storyStyle}>
			<h4 style={titleStyle}>No Collections</h4>
			<div style={wrapperStyle}>
				<DashboardSide pages={pages} collections={[]} />
			</div>
		</div>
		<div style={storyStyle}>
			<h4 style={titleStyle}>Active Page</h4>
			<div style={wrapperStyle}>
				<DashboardSide pages={pages} collections={[...collections].slice(0, 4)} activeSlug={'guidelines'} />
			</div>
		</div>
		<div style={storyStyle}>
			<h4 style={titleStyle}>Active Collection</h4>
			<div style={wrapperStyle}>
				<DashboardSide pages={pages} collections={[...collections].slice(0, 4)} activeSlug={'blockchain'} />
			</div>
		</div>
		<div style={storyStyle}>
			<h4 style={titleStyle}>Scroll</h4>
			<div style={wrapperStyle}>
				<DashboardSide pages={pages} collections={collections} />
			</div>
		</div>
	</div>
));
