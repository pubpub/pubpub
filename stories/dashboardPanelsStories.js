import React from 'react';
import { storiesOf } from '@storybook/react';
import DashboardCollection from 'components/DashboardCollection/DashboardCollection';

const pageStyle = { padding: '1.5em 2em', maxWidth: '951px' };

require('containers/Dashboard/dashboard.scss');

const collectionData = {
	title: 'Sensor Hardware',
	slug: 'sensors',
	description: 'An open collection dedicated to the free discussion of new topics relating to elephants and whales that create hardware.',
	isPrivate: true,
	isOpenSubmissions: true,
	isPage: false,
	pubs: [
		{
			id: 0,
			title: 'Open Schematics',
			slug: 'open-schematics',
			lastModified: String(new Date()),
			status: 'published',
			numContributors: 12,
			numSuggestions: 8,
			numDiscussions: 4,
		},
		{
			id: 1,
			title: 'Regulatory Endeavors of Mammals',
			slug: 'regulatory',
			lastModified: String(new Date()),
			status: 'unpublished',
			numContributors: 7,
			numSuggestions: 0,
			numDiscussions: 13,
		},
		{
			id: 2,
			title: 'A Lesson in Pedagogy',
			slug: 'pedagogy',
			lastModified: String(new Date()),
			status: 'submitted',
			numContributors: 8,
			numSuggestions: 24,
			numDiscussions: 1,
		},
	],
};

storiesOf('DashboardPanels', module)
.add('Collection', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={collectionData} />
	</div>
))
.add('Collection Edit', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={{}} />
	</div>
))
.add('Page', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={{}} />
	</div>
))
.add('Page Edit', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={{}} />
	</div>
))
.add('Activity', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={{}} />
	</div>
))
.add('Team', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={{}} />
	</div>
))
.add('Site', () => (
	<div className={'dashboard'} style={pageStyle}>
		<DashboardCollection collectionData={{}} />
	</div>
));
