import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import WrappedRoute from 'components/WrappedRoute/WrappedRoute';
import NavBar from 'components/NavBar/NavBar';
import { populateNavigationIds } from 'utilities';
import { getAppData } from 'actions/app';
import { getLogout } from 'actions/login';

require('./app.scss');

const Collection = () => <Async load={import('containers/Collection/Collection')} />;
const CollectionSubmit = () => <Async load={import('containers/CollectionSubmit/CollectionSubmit')} />;
const CommunityCreate = () => <Async load={import('containers/CommunityCreate/CommunityCreate')} />;
const Dashboard = () => <Async load={import('containers/Dashboard/Dashboard')} />;
const Explore = () => <Async load={import('containers/Explore/Explore')} />;
const Landing = () => <Async load={import('containers/Landing/Landing')} />;
const Login = () => <Async load={import('containers/Login/Login')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;
const PasswordReset = () => <Async load={import('containers/PasswordReset/PasswordReset')} />;
const Privacy = () => <Async load={import('containers/Privacy/Privacy')} />;
const PubCreate = () => <Async load={import('containers/PubCreate/PubCreate')} />;
const PubCollaboration = () => <Async load={import('containers/PubCollaboration/PubCollaboration')} />;
const PubPresentation = () => <Async load={import('containers/PubPresentation/PubPresentation')} />;
const PubRedirect = () => <Async load={import('containers/PubRedirect/PubRedirect')} />;
const Search = () => <Async load={import('containers/Search/Search')} />;
const Signup = () => <Async load={import('containers/Signup/Signup')} />;
const Terms = () => <Async load={import('containers/Terms/Terms')} />;
const User = () => <Async load={import('containers/User/User')} />;
const UserCreate = () => <Async load={import('containers/UserCreate/UserCreate')} />;

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

class App extends Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.hostname = window.location.hostname === 'localhost'
			? 'v4.pubpub.org' // Set whatever hostname you want to develop with
			: window.location.hostname; // In production, use the real hostname
		this.isBasePubPub = this.hostname === 'v4.pubpub.org';
	}

	componentWillMount() {
		this.props.dispatch(getAppData(this.hostname));
	}
	handleLogout() {
		this.props.dispatch(getLogout());
		window.location.href = window.location.origin;
	}

	render() {
		const appData = this.props.appData.data || {};
		const loginData = this.props.loginData.data || {};

		/* Display base PubPub Site */
		if (this.isBasePubPub) {
			return (
				<div>
					<Helmet>
						<title>PubPub</title>
						<meta name="description" content={'Collaborative Community Publishing'} />
						<link rel="icon" type="image/png" sizes="192x192" href={'/favicon.png'} />
						<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={'/favicon.png'} />
					</Helmet>
					<AccentStyle
						accentColor={'#112233'}
						accentTextColor={'#FFFFFF'}
						accentActionColor={'rgba(17, 34, 51, 0.6)'}
						accentHoverColor={'rgba(17, 34, 51, 0.8)'}
						accentMinimalColor={'rgba(17, 34, 51, 0.2)'}
					/>
					<Header
						userName={loginData.fullName}
						userInitials={loginData.initials}
						userSlug={loginData.slug}
						userAvatar={loginData.avatar}
						smallHeaderLogo={'/icon.png'}
						onLogout={this.handleLogout}
						isBasePubPub={true}
					/>
					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/community/create" component={CommunityCreate} />
						<Route exact path="/explore" component={Explore} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/password-reset" component={PasswordReset} />
						<Route exact path="/password-reset/:resetHash/:slug" component={PasswordReset} />
						<Route exact path="/privacy" component={Privacy} />
						<Route exact path="/pub/:slug" component={PubRedirect} />
						<Route exact path="/search" component={Search} />
						<Route exact path="/signup" component={Signup} />
						<Route exact path="/tos" component={Terms} />
						<Route exact path="/user/create/:hash" component={UserCreate} />
						<Route exact path="/user/:slug" component={User} />
						<Route exact path="/user/:slug/:mode" component={User} />
						<Route component={NoMatch} />
					</Switch>
				</div>
			);
		}

		/* If fetch is done, but no Community */
		if (this.props.appData.data && !appData.id) { return <NoMatch />; }

		/* Display nothing - or could be loading status */
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
					<link rel="icon" type="image/png" sizes="192x192" href={appData.favicon} />
					<link rel="apple-touch-icon" type="image/png" sizes="192x192" href={appData.favicon} />
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
					onLogout={this.handleLogout}
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
					<WrappedRoute exact path="/password-reset" component={PasswordReset} />
					<WrappedRoute exact path="/password-reset/:resetHash/:slug" component={PasswordReset} />
					<WrappedRoute exact path="/privacy" component={Privacy} />
					<WrappedRoute exact path="/pub/create" component={PubCreate} />
					<WrappedRoute exact path="/pub/:slug" component={PubPresentation} />
					<WrappedRoute exact path="/pub/:slug/collaborate" component={PubCollaboration} hideNav fixHeader />
					<WrappedRoute exact path="/pub/:slug/collaborate/:hash" component={PubCollaboration} hideNav fixHeader />
					<WrappedRoute exact path="/search" component={Search} />
					<WrappedRoute exact path="/signup" component={Signup} />
					<WrappedRoute exact path="/tos" component={Terms} />
					<WrappedRoute exact path="/user/create/:hash" component={UserCreate} />
					<WrappedRoute exact path="/user/:slug" component={User} />
					<WrappedRoute exact path="/user/:slug/:mode" component={User} />
					<WrappedRoute exact path="/:slug" component={Collection} />
					<WrappedRoute exact path="/:slug/submit" component={CollectionSubmit} />
					<WrappedRoute exact path="/:slug/submit/:hash" component={CollectionSubmit} />

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
