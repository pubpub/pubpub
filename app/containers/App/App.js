import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import Header from 'components/Header/Header';
import CommunityHeader from 'components/CommunityHeader/CommunityHeader';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import NavBar from 'components/NavBar/NavBar';

import { getAppData } from 'actions/app';

require('./app.scss');

const LandingMain = () => <Async load={import('containers/LandingMain/LandingMain')} />;
const LandingCommunity = () => <Async load={import('containers/LandingCommunity/LandingCommunity')} />;
const NoMatch = () => <Async load={import('containers/NoMatch/NoMatch')} />;
const Collection = () => <Async load={import('containers/Collection/Collection')} />;

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
};

class App extends Component {
	static logoutHandler() {
		console.log('Logout');
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
			accentColor: undefined,
			logo: 'https://assets.pubpub.org/_site/logo_dark.png',
			headerBackground: '',
			navItems: [],
			accentData: {},
			...this.props.appData // Override defaults with real community data
		};

		const userData = this.props.userData;

		// const isCommunity = this.hostname !== 'www.pubpub.org';

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
					userSlug={userData.slug}
					userAvatar={userData.avatar}
					userIsAdmin={userData.isAdmin}
					pageSlug={this.props.location.pathname}
					pageBackground={appData.headerBackground}
					appLogo={appData.logo}
					logoutHandler={App.logoutHandler}
				/>

				{this.props.location.pathname === '/' &&
					<CommunityHeader
						logo={appData.logo}
						description={appData.description}
						backgroundImage={appData.headerBackground}
					/>
				}

				{/* Nav Bar - Only show on community sites */}
				{appData.navItems &&
					<NavBar navItems={appData.navItems} />
				}


				<Switch>
					<Route exact path="/" component={Collection} />
					<Route exact path="/dashboard" component={NoMatch} />
					<Route exact path="/dashboard/:slug" component={NoMatch} />
					<Route exact path="/login" component={NoMatch} />
					<Route exact path="/pub/:slug" component={NoMatch} />
					<Route exact path="/pub-create" component={NoMatch} />
					<Route exact path="/resetpassword" component={NoMatch} />
					<Route exact path="/resetpassword/:resetHash/:username" component={NoMatch} />
					<Route exact path="/search" component={NoMatch} />
					<Route exact path="/signup" component={NoMatch} />
					<Route exact path="/user/:slug" component={NoMatch} />
					<Route exact path="/user-create/:hash" component={NoMatch} />
					<Route exact path="/:slug" component={Collection} />
					<Route path="/*" component={NoMatch} />
				</Switch>

			</div>
		);
	}
}

App.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app, userData: state.user }))(App));
