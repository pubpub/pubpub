import React from 'react';
import { storiesOf } from '@storybook/react';
import NavBar from 'components/NavBar/NavBar';
import AccentStyle from 'components/AccentStyle/AccentStyle';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };
const titleStyle = { margin: '1em 1em -0.5em' };

const items = [
	{
		slug: '/home',
		title: 'Home',
		id: 1,
	},
	{
		slug: '/sensors',
		title: 'Sensors',
		id: 2,
	},
	{
		id: 3.5,
		title: 'Issues',
		children: [
			{
				slug: '/2017',
				title: '2017',
				id: 21,
			},
			{
				slug: '/2016',
				title: '2016',
				id: 22,
			},
			{
				slug: '/2018',
				title: 'Super Long 2018 Edition Extravaganza',
				id: 23,
			},
		]
	},
	{
		slug: '/meeting-notes',
		title: 'Meeting-Notes',
		id: 3,
	},
	{
		slug: '/blockchain',
		title: 'Blockchain',
		id: 4,
	},
	{
		slug: '/new-ideas',
		title: 'New Ideas',
		id: 5,
	},
	{
		slug: '/bad-ideas',
		title: 'Bad-Ideas',
		id: 6,
	},
	{
		slug: '/submissions',
		title: 'Submissions',
		id: 7,
	},
	{
		slug: '/about',
		title: 'About',
		id: 8,
	},
];
const emptyItems = [];
const fewItems = [...items].slice(0, 5);
const manyItems = [...items];

const navBars = (
	<div>
		<h4 style={titleStyle}>No Items</h4>
		<div style={wrapperStyle}>
			<NavBar navItems={emptyItems} />
		</div>

		<h4 style={titleStyle}>Few Items</h4>
		<div style={wrapperStyle}>
			<NavBar navItems={fewItems} />
		</div>

		<h4 style={titleStyle}>Many Items</h4>
		<div style={wrapperStyle}>
			<NavBar navItems={manyItems} />
		</div>
	</div>
);

storiesOf('NavBar', module)
.add('Styled Dark', () => (
	<div>
		<AccentStyle
			accentColor={'#D13232'}
			accentTextColor={'#FFF'}
			accentActionColor={'#A72828'}
			accentHoverColor={'#BC2D2D'}
			accentMinimalColor={'rgba(209, 50, 50, 0.15)'}
		/>
		{navBars}
	</div>
))
.add('Styled Light', () => (
	<div>
		<AccentStyle
			accentColor={'#26E0D0'}
			accentTextColor={'#000'}
			accentActionColor={'#51E6D9'}
			accentHoverColor={'#3BE3D4'}
			accentMinimalColor={'rgba(38, 224, 208, 0.15)'}
		/>
		{navBars}
	</div>
));
