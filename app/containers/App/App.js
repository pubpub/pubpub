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
import { populateNavigationIds } from 'utilities';

import { getAppData } from 'actions/app';

require('./app.scss');

const Collection = () => <Async load={import('containers/Collection/Collection')} />;
const Dashboard = () => <Async load={import('containers/Dashboard/Dashboard')} />;
const Login = () => <Async load={import('containers/Login/Login')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;
const PubCollaboration = () => <Async load={import('containers/PubCollaboration/PubCollaboration')} />;
const PubPresentation = () => <Async load={import('containers/PubPresentation/PubPresentation')} />;
const Search = () => <Async load={import('containers/Search/Search')} />;
const User = () => <Async load={import('containers/User/User')} />;

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

class App extends Component {
	static logoutHandler() {
		// console.log('Logout');
	}

	componentWillMount() {
		// this.hostname = window.location.hostname === 'localhost' || window.location.hostname === 'v4test.netlify.com'
		// 	? 'viral.pubpub.org' // Set whatever hostname you want to develop with
		// 	: window.location.hostname; // In production, use the real hostname

		// this.hostname = 'stewart3756.pubpub.org';
		this.hostname = 'mertie2727.pubpub.org';
		this.props.dispatch(getAppData(this.hostname));
	}

	render() {
		const appData = this.props.appData.data || {};
		const loginData = this.props.loginData.data || {};

		if (!appData.id) { return <div />; }

		const isHome = this.props.location.pathname === '/';

		const collections = appData.collections || [];
		const navigation = appData.navigation || [];
		const navItems = populateNavigationIds(collections, navigation);

		return (
			<div>
				<Helmet>
					<title>{appData.title}</title>
					<meta name="description" content={appData.description} />
					<link rel="icon" type="image/png" sizes="192x192" href={appData.avatar} />
					<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={appData.avatar} />
				</Helmet>

				{appData.accentColor &&
					<AccentStyle
						accentColor={appData.accentColor}
						accentTextColor={appData.accentTextColor}
						accentActionColor={appData.accentActionColor}
						accentHoverColor={appData.accentHoverColor}
						accentMinimalColor={appData.accentMinimalColor}
					/>
				}

				{/* Inclues logo, login, search, profile buttons */}
				<Header
					userName={loginData.fullName}
					userInitials={loginData.initials}
					userSlug={loginData.slug}
					userAvatar={loginData.avatar}
					userIsAdmin={loginData.isAdmin}
					smallHeaderLogo={appData.smallHeaderLogo}
					largeHeaderLogo={appData.largeHeaderLogo}
					largeHeaderBackground={appData.largeHeaderBackground}
					largeHeaderDescription={appData.description}
					isLargeHeader={isHome}
					logoutHandler={App.logoutHandler}
				/>

				{navItems.length > 0 &&
					<NavBar navItems={navItems} />
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
					<WrappedRoute exact path="/search" component={Search} />
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
export default withRouter(connect(state => ({
	appData: state.app,
	loginData: state.login
}))(App));
