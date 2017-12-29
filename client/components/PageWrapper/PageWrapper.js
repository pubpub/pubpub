import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import NavBar from 'components/NavBar/NavBar';
import {populateNavigationIds } from 'utilities';

const propTypes = {
	children: PropTypes.node.isRequired,
	loginData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	isBasePubPub: PropTypes.bool.isRequired,
	fixHeader: PropTypes.bool,
	hideNav: PropTypes.bool,
	hideFooter: PropTypes.bool,
};

const defaultProps = {
	fixHeader: false,
	hideNav: false,
	hideFooter: false,
};

class PageWrapper extends Component {
	render() {
		const loginData = this.props.loginData;
		const communityData = this.props.communityData;

		const collections = communityData.collections || [];
		const navigation = communityData.navigation || [];
		const navItems = populateNavigationIds(collections, navigation);
		return (
			<div id="page-wrapper-component">
				{this.props.fixHeader &&
					<style>
						{`
							.header { position: fixed; width: 100%; z-index: 19; }
							.route-content { padding-top: 56px; }
						`}
					</style>
				}
				

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

				{!this.props.hideNav &&
					<NavBar navItems={navItems} />
				}

				<div className="page-content">
					{this.props.children}
				</div>

				{!this.props.hideFooter &&
					<Footer
						isAdmin={loginData.isAdmin}
						isBasePubPub={this.props.isBasePubPub}
					/>
				}
			</div>
		);
	}
}

PageWrapper.propTypes = propTypes;
PageWrapper.defaultProps = defaultProps;
export default PageWrapper;
