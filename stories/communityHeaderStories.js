import React from 'react';
import { storiesOf } from '@storybook/react';
import Header from 'components/Header/Header';
import CommunityHeader from 'components/CommunityHeader/CommunityHeader';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import NavBar from 'components/NavBar/NavBar';
import { navItems, accentDataDark, accentDataLight } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };
const titleStyle = { margin: '1em 1em -0.5em' };
const logoutHandler = ()=>{};

const headers = (
	<div>
		<h4 style={titleStyle}>Background and Description</h4>
		<div style={wrapperStyle}>
			<Header
				userName={'Maggie Farnkrux'}
				userSlug={'maggiefarn'}
				userAvatar={'/dev/maggie.jpg'}
				userIsAdmin={true}
				pageSlug={''}
				pageBackground={'/dev/homeBackground.png'}
				appLogo={'/dev/viralLogo.png'}
				logoutHandler={logoutHandler}
			/>
			<CommunityHeader
				logo={'/dev/viralLogo.png'}
				description={'Group publications and research docs'}
				backgroundImage={'/dev/homeBackground.png'}
			/>
			<NavBar navItems={navItems} />
		</div>

		<h4 style={titleStyle}>No background</h4>
		<div style={wrapperStyle}>
			<Header
				userName={'Maggie Farnkrux'}
				userSlug={'maggiefarn'}
				userAvatar={'/dev/maggie.jpg'}
				userIsAdmin={true}
				pageSlug={''}
				appLogo={'/dev/viralLogo.png'}
				logoutHandler={logoutHandler}
			/>
			<CommunityHeader
				logo={'/dev/viralLogo.png'}
				description={'Group publications and research docs'}
			/>
			<NavBar navItems={navItems} />
		</div>

		<h4 style={titleStyle}>No description</h4>
		<div style={wrapperStyle}>
			<Header
				userName={'Maggie Farnkrux'}
				userSlug={'maggiefarn'}
				userAvatar={'/dev/maggie.jpg'}
				userIsAdmin={true}
				pageSlug={''}
				pageBackground={'/dev/homeBackground.png'}
				appLogo={'/dev/viralLogo.png'}
				logoutHandler={logoutHandler}
			/>
			<CommunityHeader
				logo={'/dev/viralLogo.png'}
				backgroundImage={'/dev/homeBackground.png'}
			/>
			<NavBar navItems={navItems} />
		</div>

	</div>
);

storiesOf('CommunityHeader', module)
.add('Styled Dark', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		{headers}
	</div>
))
.add('Styled Light', () => (
	<div>
		<AccentStyle {...accentDataLight} />
		{headers}
	</div>
));
