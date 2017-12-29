import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { hydrateWrapper } from 'utilities';

if (typeof require.ensure === 'function') {
	require('./landing.scss');
}

const propTypes = {
	loginData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	isBasePubPub: PropTypes.bool.isRequired,
};

class Landing extends Component {
	render() {
		const loginData = this.props.loginData;
		const communityData = this.props.communityData;

		return (
			<div id="landing-container">
				<AccentStyle
					accentColor={communityData.accentColor}
					accentTextColor={communityData.accentTextColor}
					accentActionColor={communityData.accentActionColor}
					accentHoverColor={communityData.accentHoverColor}
					accentMinimalColor={communityData.accentMinimalColor}
				/>
				<Header
					userName={loginData.name}
					userInitials={loginData.initials}
					userSlug={loginData.slug}
					userAvatar={loginData.avatar}
					userIsAdmin={loginData.isAdmin}
					smallHeaderLogo={communityData.smallHeaderLogo}
					largeHeaderLogo={communityData.largeHeaderLogo}
					largeHeaderDescription={communityData.largeHeaderDescription}
					largeHeaderBackground={communityData.largeHeaderBackground}
					onLogout={()=> {}}
					isBasePubPub={this.props.isBasePubPub}
					isLandingPage={true}
				/>

				<div className="page-content">
					<h2>Landing!!</h2>
					<input className={'pt-input'} type={'text'} />
				</div>

				<Footer
					isAdmin={loginData.isAdmin}
					isBasePubPub={this.props.isBasePubPub}
				/>
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default Landing;

hydrateWrapper(Landing);
