import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import { IntlProvider } from 'react-intl';
import AppNav from 'components/AppNav/AppNav';
import AppFooter from 'components/AppFooter/AppFooter';
import Announcements from 'components/Announcements/Announcements';
import { login, logout } from './actions';

require('../../../static/blueprint.scss');
require('../../../static/style.scss');
require('../../../static/pubBody.scss');
require('../../../static/markdown.scss');

export const App = React.createClass({
	propTypes: {
		appData: PropTypes.object,
		accountData: PropTypes.object,
		journalData: PropTypes.object,
		pubData: PropTypes.object,
		location: PropTypes.object,
		params: PropTypes.object,
		router: PropTypes.object,
		route: PropTypes.object,
		children: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		const FocusStyleManager = require('@blueprintjs/core').FocusStyleManager;
		FocusStyleManager.onlyShowFocusOnTabs();
		this.props.dispatch(login());
	},

	componentWillReceiveProps(nextProps) {
		// On each routeChange, we need to update setRouteLeaveHook. 
		// This will make sure we throw a warning if window.unsavedEdits is truthy
		window.onbeforeunload = this.confirmExit;
		nextProps.router.setRouteLeaveHook(nextProps.router.routes[1], this.confirmExit.bind(this, nextProps));
	},

	confirmExit: function(props, nextRoute) {

		// const stayingInFiles = props && nextRoute && ((props.params.meta === 'files' && nextRoute.pathname.indexOf(`/pub/${props.params.slug}/files`) > -1) || (props.params.meta === undefined && nextRoute.pathname.indexOf(`/pub/${props.params.slug}/files`) > -1));
		const stayingInFiles = props && nextRoute && props.params.meta === 'edit' && nextRoute.pathname.indexOf(`/pub/${props.params.slug}/edit`) > -1;
		if (window.unsavedEdits && !stayingInFiles) {
			return 'Your unsaved changes will be lost.';
		}
		return null;
	},

	logoutHandler: function() {
		this.props.dispatch(logout());
	},

	isProduction: function() {
		const hostname = window.location.hostname;
		if (hostname === 'dev.pubpub.org' || hostname === 'staging.pubpub.org') {
			return false;
		}
		return true;
	},

	render() {
		const loginFinished = this.props.appData.loginFinished;
		const hiddenStyle = loginFinished
			? {}
			: { height: '0px', overflow: 'hidden', opacity: 0 };
		return (
			<IntlProvider locale={'en'} messages={{}}>
				<StyleRoot>
					<Helmet 
						title="PubPub"  
						meta={[
							{ name: 'ROBOTS', content: this.isProduction() ? 'INDEX, FOLLOW' : 'NOINDEX, NOFOLLOW' },
							{ name: 'description', content: 'PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.' },
							{ property: 'og:title', content: 'PubPub' },
							{ property: 'og:type', content: 'website' },
							{ property: 'og:description', content: 'PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.' },
							{ property: 'og:url', content: 'https://www.pubpub.org/' },
							{ property: 'og:image', content: 'https://assets.pubpub.org/_site/logo_dark.png' },
							{ property: 'og:image:url', content: 'https://assets.pubpub.org/_site/logo_dark.png' },
							{ property: 'og:image:width', content: '500' },
							{ property: 'fb:app_id', content: '924988584221879' },
							{ name: 'twitter:card', content: 'summary' },
							{ name: 'twitter:site', content: '@pubpub' },
							{ name: 'twitter:title', content: 'PubPub' },
							{ name: 'twitter:description', content: 'PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.' },
							{ name: 'twitter:image', content: 'https://assets.pubpub.org/_site/logo_dark.png' },
							{ name: 'twitter:image:alt', content: 'Logo for PubPub' }
						]} 
						link={window.isJournal ? [] : [{ rel: 'shortcut icon', href: '/static/favicon.ico' }]}
					/> 
					<div style={hiddenStyle}>
						<Announcements />
						<AppNav accountData={this.props.accountData} pubData={this.props.pubData} journalData={this.props.journalData} location={this.props.location} params={this.props.params} logoutHandler={this.logoutHandler} />
						<div style={{ minHeight: 'calc(100vh - 75px)' }}>{this.props.children}</div>
						<AppFooter />
					</div>
				</StyleRoot>
			</IntlProvider>
		);
	},

});

function mapStateToProps(state) {
	return {
		appData: state.app.toJS(),
		accountData: state.account.toJS(),
		journalData: state.journal.toJS(),
		pubData: state.pub.toJS(),
	};
}

export default connect(mapStateToProps)(App);

