import React from 'react';
import { storiesOf } from '@storybook/react';
import Header from 'components/Header/Header';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, accentDataLight } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };
const titleStyle = { margin: '1em 1em -0.5em' };
const logoutHandler = ()=>{};

const headerBars = function(logoUrl) {
	return (
		<div>
			<h4 style={titleStyle}>Logged Out</h4>
			<div style={wrapperStyle}>
				<Header
					pageSlug={'about'}
					appLogo={logoUrl}
					logoutHandler={logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Logged In · User</h4>
			<div style={wrapperStyle}>
				<Header
					userName={'Maggie Farnkrux'}
					userInitials={'MF'}
					userSlug={'maggiefarn'}
					userIsAdmin={false}
					pageSlug={'about'}
					appLogo={logoUrl}
					logoutHandler={logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Logged In · Admin</h4>
			<div style={wrapperStyle}>
				<Header
					userName={'Maggie Farnkrux'}
					userSlug={'maggiefarn'}
					userAvatar={'/dev/maggie.jpg'}
					userIsAdmin={true}
					pageSlug={'about'}
					appLogo={logoUrl}
					logoutHandler={logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Home · No Background</h4>
			<div style={wrapperStyle}>
				<Header
					userName={'Maggie Farnkrux'}
					userSlug={'maggiefarn'}
					userAvatar={'/dev/maggie.jpg'}
					userIsAdmin={true}
					pageSlug={''}
					appLogo={logoUrl}
					logoutHandler={logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Home · Background (Blank)</h4>
			<div style={wrapperStyle}>
				<Header
					pageSlug={''}
					pageBackground={'/dev/homeBackground.png'}
					appLogo={logoUrl}
					logoutHandler={logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Home · Background (Image)</h4>
			<div style={{ ...wrapperStyle, backgroundImage: 'url("/dev/homeBackground.png")' }}>
				<Header
					userName={'Maggie Farnkrux'}
					userSlug={'maggiefarn'}
					userAvatar={'/dev/maggie.jpg'}
					userIsAdmin={true}
					pageSlug={''}
					pageBackground={'/dev/homeBackground.png'}
					appLogo={logoUrl}
					logoutHandler={logoutHandler}
				/>
			</div>
		</div>
	);
};

storiesOf('Header', module)
.add('PubPub', () => (
	<div>
		{headerBars('/dev/pubpubLogo.png')}
	</div>
))
.add('Styled Dark', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		{headerBars('/dev/viralLogo.png')}
	</div>
))
.add('Styled Light', () => (
	<div>
		<AccentStyle {...accentDataLight} />
		{headerBars('/dev/cpLogo.png')}
	</div>
));
