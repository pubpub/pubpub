import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import WrappedRoute from 'components/WrappedRoute/WrappedRoute';
import NavBar from 'components/NavBar/NavBar';

import { getAppData } from 'actions/app';

require('./app.scss');

const Collection = () => <Async load={import('containers/Collection/Collection')} />;
const Dashboard = () => <Async load={import('containers/Dashboard/Dashboard')} />;
const Login = () => <Async load={import('containers/Login/Login')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;
const PubCollaboration = () => <Async load={import('containers/PubCollaboration/PubCollaboration')} />;
const PubPresentation = () => <Async load={import('containers/PubPresentation/PubPresentation')} />;
const User = () => <Async load={import('containers/User/User')} />;

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
};

class App extends Component {
	static logoutHandler() {
		// console.log('Logout');
	}

	componentWillMount() {
		this.hostname = window.location.hostname === 'localhost' || window.location.hostname === 'v4test.netlify.com'
			? 'viral.pubpub.org' // Set whatever hostname you want to develop with
			: window.location.hostname; // In production, use the real hostname

		this.props.dispatch(getAppData(this.hostname));
	}

	render() {
		const appData = {
			title: 'PubPub',
			description: 'Collaborative Community Publishing',
			avatar: '/icon.png',
			smallHeaderLogo: 'https://assets.pubpub.org/_site/logo_dark.png',
			largeHeaderLogo: '',
			largeHeaderBackground: '',
			navItems: [],
			accentData: {},
			collections: [],
			...this.props.appData // Override defaults with real community data
		};

		const userData = this.props.userData;

		const isCommunity = this.hostname !== 'www.pubpub.org';
		const isHome = this.props.location.pathname === '/';

		// const fullWrappers = { navItems: appData.navItems };
		// const fixedPage = { navItems: undefined, fixHeader: true, hideFooter: true };
		// const hideFooter = { navItems: appData.navItems, hideFooter: true };

		return (
			<div>
				<Helmet>
					<title>{appData.title}</title>
					<meta name="description" content={appData.description} />
					<link rel="icon" type="image/png" sizes="192x192" href={appData.avatar} />
					<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={appData.avatar} />
				</Helmet>

				{appData.accentData.accentColor &&
					<AccentStyle {...appData.accentData} />
				}

				{/* Inclues logo, login, search, profile buttons */}
				<Header
					userName={userData.fullName}
					userInitials={userData.initials}
					userSlug={userData.slug}
					userAvatar={userData.avatar}
					userIsAdmin={userData.isAdmin}
					smallHeaderLogo={appData.smallHeaderLogo}
					largeHeaderLogo={appData.largeHeaderLogo}
					largeHeaderBackground={appData.largeHeaderBackground}
					largeHeaderDescription={appData.description}
					isLargeHeader={isCommunity && isHome}
					logoutHandler={App.logoutHandler}
				/>

				{appData.navItems &&
					<NavBar navItems={appData.navItems} />
				}

				<Switch>
					<WrappedRoute exact path="/" component={Collection} />
					<WrappedRoute exact path="/dashboard" component={Dashboard} hideNav fixHeader />
					<WrappedRoute exact path="/dashboard/:slug" component={Dashboard} hideNav fixHeader />
					<WrappedRoute exact path="/dashboard/:slug/:mode" component={Dashboard} hideNav fixHeader />
					<WrappedRoute exact path="/login" component={Login} />
					<WrappedRoute exact path="/pub/:slug" component={PubPresentation} />
					<WrappedRoute exact path="/pub/:slug/collaborate" component={PubCollaboration} hideNav fixHeader />
					<WrappedRoute exact path="/pub-create" component={NoMatch} />
					<WrappedRoute exact path="/resetpassword" component={NoMatch} />
					<WrappedRoute exact path="/resetpassword/:resetHash/:username" component={NoMatch} />
					<WrappedRoute exact path="/search" component={NoMatch} />
					<WrappedRoute exact path="/signup" component={NoMatch} />
					<WrappedRoute exact path="/user/:slug" component={User} />
					<WrappedRoute exact path="/user/:slug/:mode" component={User} />
					<WrappedRoute exact path="/user-create" component={NoMatch} />
					<WrappedRoute exact path="/user-create/:hash" component={NoMatch} />
					<WrappedRoute exact path="/:slug" component={Collection} />
				</Switch>

			</div>
		);
	}
}

App.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app, userData: state.user }))(App));
