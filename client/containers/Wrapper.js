import React from 'react';
import PropTypes from 'prop-types';
import Login from 'containers/Login/Login';
import Pub from 'containers/Pub/Pub';
import { hydrateWrapper, populateNavigationIds } from 'utils';
import classNames from 'classnames';
import { Header, Footer, GdprBanner, AccentStyle, NavBar, Icon, SkipLink } from 'components';
import { PageContext } from 'utils/hooks';
import SideMenu from 'components/PageWrapper/SideMenu';
import Breadcrumbs from 'components/PageWrapper/Breadcrumbs';

require('../styles/base.scss');

const propTypes = {
	chunkName: PropTypes.string.isRequired,
	initialData: PropTypes.object.isRequired,
	viewData: PropTypes.object.isRequired,
};

const Wrapper = (props) => {
	const { chunkName, initialData, viewData } = props;
	const paths = {
		Login: { activeComponent: () => <Login {...viewData} />, hideNav: true, hideFooter: true },
		Pub: { activeComponent: () => <Pub {...viewData} /> },
	};

	const { activeComponent, hideNav, hideFooter, isDashboard } = paths[chunkName];
	const { loginData, communityData, locationData, scopeData } = initialData;
	const pages = communityData.pages || [];
	const navigation = communityData.navigation || [];
	const navItems = populateNavigationIds(pages, navigation);
	const socialItems = [
		{
			id: 'si-0',
			icon: <Icon icon="globe" />,
			title: 'Website',
			value: communityData.website,
			url: communityData.website,
		},
		{
			id: 'si-1',
			icon: <Icon icon="twitter" />,
			title: 'Twitter',
			value: communityData.twitter,
			url: `https://twitter.com/${communityData.twitter}`,
		},
		{
			id: 'si-2',
			icon: <Icon icon="facebook" />,
			title: 'Facebook',
			value: communityData.facebook,
			url: `https://facebook.com/${communityData.facebook}`,
		},
		{
			id: 'si-3',
			icon: <Icon icon="envelope" />,
			title: 'Contact',
			value: communityData.email,
			url: `mailto:${communityData.email}`,
		},
	].filter((item) => {
		return item.value;
	});

	const pageContextProps = {
		communityData: communityData,
		loginData: loginData,
		locationData: locationData,
		scopeData: scopeData,
	};

	const showNav = !hideNav && !communityData.hideNav && !isDashboard;
	const showFooter = !hideFooter && !isDashboard;
	return (
		<PageContext.Provider value={pageContextProps}>
			<div id="page-wrapper-component" className={classNames({ dashboard: isDashboard })}>
				<AccentStyle communityData={communityData} isNavHidden={!showNav} />

				{locationData.isDuqDuq && (
					<div className="duqduq-warning">Development Environment</div>
				)}

				<SkipLink targetId="main-content">Skip to main content</SkipLink>

				<GdprBanner loginData={loginData} />

				<Header />

				{showNav && <NavBar navItems={navItems} socialItems={socialItems} />}

				{isDashboard && (
					<div className="side-content">
						<SideMenu />
					</div>
				)}

				{isDashboard && <Breadcrumbs />}

				<div id="main-content" tabIndex="-1" className="page-content">
					{activeComponent()}
				</div>

				{showFooter && (
					<Footer
						isAdmin={loginData.isAdmin}
						isBasePubPub={locationData.isBasePubPub}
						communityData={communityData}
						socialItems={socialItems}
					/>
				)}
			</div>
		</PageContext.Provider>
	);
};

Wrapper.propTypes = propTypes;
export default Wrapper;

hydrateWrapper(Wrapper);
