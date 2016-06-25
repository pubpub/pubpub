import React, { PropTypes } from 'react';
import {StyleRoot} from 'radium';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {loadAppAndLogin} from './actions';
import {logout} from 'containers/Login/actions';
import {createAtom} from 'containers/AtomEditor/actions';
import {IntlProvider} from 'react-intl';
import {safeGetInToJS} from 'utils/safeParse';

import AppLoadingBar from './AppLoadingBar';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

import analytics from 'utils/analytics';


export const App = React.createClass({
	propTypes: {
		appData: PropTypes.object,
		loginData: PropTypes.object,
		path: PropTypes.string,
		slug: PropTypes.string,
		children: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch) {
			if (getState().app.get('loadAttempted') === false) {
				return dispatch(loadAppAndLogin());
			}
			return ()=>{};
		}
	},

	componentDidMount() {
		analytics.pageView(this.props.path, this.props.loginData.get('loggedIn'));
	},

	componentWillReceiveProps(nextProps) {
		// Redirect to home if logged out
		if (this.props.loginData.get('loggedIn') && !nextProps.loginData.get('loggedIn')) {
			this.props.dispatch(pushState(null, '/'));
		}
	},

	createDocument: function() {
		this.props.dispatch(createAtom('markdown'));
	},

	logoutHandler: function() {
		this.props.dispatch(logout());
	},

	render: function() {
		const messages = safeGetInToJS(this.props.appData, ['languageObject']) || {}; // Messages includes all of the strings used on the site. Language support is implemented by sending a different messages object.
		const hideFooter = this.props.path.substring(this.props.path.length - 6, this.props.path.length) === '/draft' || this.props.path.substring(this.props.path.length - 6, this.props.path.length) === '/login' || this.props.path.substring(this.props.path.length - 7, this.props.path.length) === '/signup'; // We want to hide the footer if we are in the editor or login. All other views show the footer.
		const metaData = { // Metadata that will be used by Helmet to populate the <head> tag
			meta: [
				{property: 'og:site_name', content: 'PubPub'},
				{property: 'og:url', content: 'https://www.pubpub.org' + this.props.path},
				{property: 'og:type', content: 'website'},
				{property: 'fb:app_id', content: '924988584221879'},
			]
		};

		return (

			<IntlProvider locale={'en'} messages={messages}>
				<StyleRoot>
					
					<Helmet {...metaData} />

					<AppLoadingBar color={'#BBBDC0'} show={this.props.appData.get('loading')} />
					<AppHeader loginData={this.props.loginData} path={this.props.path} createDocument={this.createDocument} logoutHandler={this.logoutHandler}/>
					<div className="content"> {this.props.children} </div>
					<AppFooter hideFooter={hideFooter} />

				</StyleRoot>
			</IntlProvider>
		);
	}

});

export default connect( state => {
	return {
		appData: state.app,
		loginData: state.login,
		path: state.router.location.pathname,
		slug: state.router.params.slug,
	};
})( App );
