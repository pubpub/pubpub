import React from 'react';
import { storiesOf } from '@storybook/react';
import Header from 'components/Header/Header';
import AccentStyle from 'components/AccentStyle/AccentStyle';

const wrapperStyle = { margin: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)' };
const titleStyle = { margin: '1em 1em -0.5em' };

const headerBars = function(logoUrl) {
	return (
		<div>
			<h4 style={titleStyle}>Logged Out</h4>
			<div style={wrapperStyle}>
				<Header
					pageSlug={'about'}
					appLogo={logoUrl}
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
				/>
			</div>

			<h4 style={titleStyle}>Home · Background (Blank)</h4>
			<div style={wrapperStyle}>
				<Header
					pageSlug={''}
					pageBackground={'/dev/homeBackground.png'}
					appLogo={logoUrl}
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
		<AccentStyle
			accentColor={'#D13232'}
			accentTextColor={'#FFF'}
			accentActionColor={'#A72828'}
			accentHoverColor={'#BC2D2D'}
			accentMinimalColor={'rgba(209, 50, 50, 0.15)'}
		/>
		{headerBars('/dev/viralLogo.png')}
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
		{headerBars('/dev/cpLogo.png')}
	</div>
));
