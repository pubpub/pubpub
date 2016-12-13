import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyleRoot } from 'radium';
import Helmet from 'react-helmet';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import { AppNav, AppFooter } from 'components';
import { login, logout } from './actions';


// if (process.env.NODE_ENV !== 'production') {
	require('../../../static/style.css');
// }

addLocaleData([...en, ...fr, ...es]);

export const App = React.createClass({
	propTypes: {
		appData: PropTypes.object,
		accountData: PropTypes.object,
		children: PropTypes.object,
		dispatch: PropTypes.func,
	},

	// statics: {
	// 	readyOnActions: function(dispatch) {
	// 		return Promise.all([
				
	// 		]);
	// 	}
	// },

	logoutHandler: function() {
		this.props.dispatch(logout());
	},
	componentDidMount() {
		const FocusStyleManager = require('@blueprintjs/core').FocusStyleManager;
		FocusStyleManager.onlyShowFocusOnTabs();
		this.props.dispatch(login());
	},

	render() {
		const messages = {};
		const locale = 'en';
		const loginFinished = this.props.appData.loginFinished;
		const hiddenStyle = loginFinished
			? {}
			: {
				height: '0px',
				overflow: 'hidden',
			};
		return (
			<IntlProvider locale={locale} messages={messages}>
				<StyleRoot>
					<Helmet 
						title="PubPub Test"  
						meta={[
							{ name: 'description', content: 'A simple tool testing PubPub v3' },
							{ property: 'og:title', content: 'PubPub Test' },
							{ property: 'og:type', content: 'website' },
							{ property: 'og:description', content: 'A simple tool testing PubPub v3' },
							{ property: 'og:url', content: 'https://www.listoflinks.co/' },
							{ property: 'og:image', content: 'https://www.listoflinks.co/static/logo_large.png' },
							{ property: 'og:image:url', content: 'https://www.listoflinks.co/static/logo_large.png' },
							{ property: 'og:image:width', content: '500' },
							{ name: 'twitter:card', content: 'summary' },
							{ name: 'twitter:site', content: '@listoflinks' },
							{ name: 'twitter:title', content: 'List of Links' },
							{ name: 'twitter:description', content: 'A simple tool testing PubPub v3' },
							{ name: 'twitter:image', content: 'https://www.listoflinks.co/static/logo_large.png' },
							{ name: 'twitter:image:alt', content: 'Logo for List of Links' }
						]} 
					/> 
					{/*<div style={hiddenStyle}>*/}
						<AppNav accountData={this.props.accountData} logoutHandler={this.logoutHandler} />
						<div style={{ minHeight: 'calc(100vh - 75px)' }}>{this.props.children}</div>
						<AppFooter />
					{/*</div>*/}
				</StyleRoot>
			</IntlProvider>
		);
	},

});

function mapStateToProps(state) {
	return {
		appData: state.app.toJS(),
		accountData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(App);

