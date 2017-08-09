import React from 'react';
import { storiesOf } from '@storybook/react';
import Header from 'components/Header/Header';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, accentDataLight } from './_data';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };
const titleStyle = { margin: '1em 1em -0.5em' };

const headerBars = function(logoUrl) {
	const data = {
		userName: 'Maggie Farnkrux',
		userInitials: 'MF',
		userSlug: 'maggiefarn',
		userAvatar: '/dev/maggie.jpg',
		userIsAdmin: true,
		smallHeaderLogo: logoUrl,
		largeHeaderLogo: logoUrl,
		largeHeaderDescription: 'Group publications and research docs from around the world all situated here in this little community.',
		largeHeaderBackground: '/dev/homeBackground.png',
		isLargeHeader: true,
		logoutHandler: ()=> {},
	};
	return (
		<div>
			<h4 style={titleStyle}>Logged Out</h4>
			<div style={wrapperStyle}>
				<Header
					smallHeaderLogo={data.smallHeaderLogo}
					logoutHandler={data.logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Logged In · User</h4>
			<div style={wrapperStyle}>
				<Header
					userName={data.userName}
					userInitials={data.userInitials}
					userSlug={data.userSlug}
					userIsAdmin={false}
					smallHeaderLogo={data.smallHeaderLogo}
					logoutHandler={data.logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Logged In · Admin</h4>
			<div style={wrapperStyle}>
				<Header
					userName={data.userName}
					userInitials={data.userInitials}
					userSlug={data.userSlug}
					userAvatar={data.userAvatar}
					userIsAdmin={true}
					smallHeaderLogo={data.smallHeaderLogo}
					logoutHandler={data.logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Home · No Background</h4>
			<div style={wrapperStyle}>
				<Header
					userName={data.userName}
					userInitials={data.userInitials}
					userSlug={data.userSlug}
					userAvatar={data.userAvatar}
					userIsAdmin={true}
					smallHeaderLogo={data.smallHeaderLogo}
					largeHeaderLogo={data.largeHeaderLogo}
					largeHeaderDescription={data.largeHeaderDescription}
					isLargeHeader={logoUrl !== '/dev/pubpubLogo.png'}
					logoutHandler={data.logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Home · Background (White to Test Gradient)</h4>
			<div style={wrapperStyle}>
				<Header
					userName={data.userName}
					userInitials={data.userInitials}
					userSlug={data.userSlug}
					userAvatar={data.userAvatar}
					userIsAdmin={true}
					smallHeaderLogo={data.smallHeaderLogo}
					largeHeaderLogo={data.largeHeaderLogo}
					largeHeaderDescription={data.largeHeaderDescription}
					largeHeaderBackground={'/dev/whiteBackground.png'}
					isLargeHeader={logoUrl !== '/dev/pubpubLogo.png'}
					logoutHandler={data.logoutHandler}
				/>
			</div>

			<h4 style={titleStyle}>Home · Background (Image)</h4>
			<div style={wrapperStyle}>
				<Header
					userName={data.userName}
					userInitials={data.userInitials}
					userSlug={data.userSlug}
					userAvatar={data.userAvatar}
					userIsAdmin={true}
					smallHeaderLogo={data.smallHeaderLogo}
					largeHeaderLogo={data.largeHeaderLogo}
					largeHeaderDescription={data.largeHeaderDescription}
					largeHeaderBackground={'/dev/homeBackground.png'}
					isLargeHeader={logoUrl !== '/dev/pubpubLogo.png'}
					logoutHandler={data.logoutHandler}
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
