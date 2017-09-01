import React from 'react';
import { storiesOf } from '@storybook/react';
import DashboardSide from 'components/DashboardSide/DashboardSide';
import { populateNavigationIds } from 'utilities';
import { communityData } from './_data';

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

const navItems = populateNavigationIds(communityData.collections, communityData.navigation);
const pages = navItems.filter((item)=> {
	return item.isPage;
});
const collections = navItems.filter((item)=> {
	return !item.isPage;
});

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
