import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import NavBar from 'components/NavBar/NavBar';
import { populateNavigationIds } from 'utilities';

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
	fixHeader: PropTypes.bool,
	hideNav: PropTypes.bool,
	hideFooter: PropTypes.bool,
};

const defaultProps = {
	fixHeader: false,
	hideNav: false,
	hideFooter: false,
};

const PageWrapper = (props)=> {
	const loginData = props.loginData;
	const communityData = props.communityData;

	const collections = communityData.collections || [];
	const navigation = communityData.navigation || [];
	const navItems = populateNavigationIds(collections, navigation);
	return (
		<div id="page-wrapper-component">
			{props.fixHeader &&
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
				locationData={props.locationData}
				userName={loginData.fullName}
				userInitials={loginData.initials}
				userSlug={loginData.slug}
				userAvatar={loginData.avatar}
				userIsAdmin={loginData.isAdmin}
				smallHeaderLogo={communityData.smallHeaderLogo}
				largeHeaderLogo={communityData.largeHeaderLogo}
				largeHeaderDescription={communityData.largeHeaderDescription}
				largeHeaderBackground={communityData.largeHeaderBackground}
				// onLogout={()=> {}}
				isBasePubPub={props.locationData.isBasePubPub}
				isLandingPage={props.locationData.path === '/'}
			/>

			{!props.hideNav &&
				<NavBar navItems={navItems} />
			}

			<div className="page-content">
				{props.children}
			</div>

			{!props.hideFooter &&
				<Footer
					isAdmin={loginData.isAdmin}
					isBasePubPub={props.locationData.isBasePubPub}
				/>
			}
		</div>
	);
};

PageWrapper.propTypes = propTypes;
PageWrapper.defaultProps = defaultProps;
export default PageWrapper;
