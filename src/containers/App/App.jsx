import React, { PropTypes } from 'react';
import {StyleRoot} from 'radium';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {loadAppAndLogin} from './actions';
import AppBody from './AppBody';
import {NotFound} from 'components';

import {IntlProvider} from 'react-intl';

const App = React.createClass({
	propTypes: {
		appData: PropTypes.object,
		loginData: PropTypes.object,
		pubData: PropTypes.object,
		path: PropTypes.string,
		slug: PropTypes.string,
		children: PropTypes.object.isRequired,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch) {
			if (getState().app.get('baseSubdomain') === undefined) {
				return dispatch(loadAppAndLogin());
			}
			return ()=>{};
		}
	},

	render: function() {
		if (this.props.appData.get('baseSubdomain') === undefined) {
			return (
				<IntlProvider locale={'en'} messages={{}}>
					<StyleRoot>
						<NotFound />
					</StyleRoot>
				</IntlProvider>
			);
		}
		const journalURL = this.props.appData.getIn(['journalData', 'customDomain']) ? 'http://' + this.props.appData.getIn(['journalData', 'customDomain']) : 'http://' + this.props.appData.getIn(['journalData', 'subdomain']) + '.pubpub.org';
		const currentBaseURL = this.props.appData.get('baseSubdomain') ? journalURL : 'http://www.pubpub.org';
		const rootImage = this.props.appData.getIn(['journalData', 'journalLogoURL']) ? this.props.appData.getIn(['journalData', 'journalLogoURL']) : 'https://s3.amazonaws.com/pubpub-upload/pubpubDefaultTitle.png';
		const metaData = {
			meta: [
				{name: 'description', content: 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.'},
				{property: 'og:site_name', content: 'PubPub'},
				{property: 'og:title', content: this.props.appData.get('baseSubdomain') ? this.props.appData.getIn(['journalData', 'journalName']) : 'PubPub'},
				{property: 'og:description', content: 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.'},
				{property: 'og:url', content: currentBaseURL + this.props.path},
				{property: 'og:type', content: 'website'},
				{property: 'og:image', content: rootImage},
				{property: 'fb:app_id', content: '924988584221879'},
			]
		};

		return (

			<IntlProvider locale={'en'} messages={this.props.appData.get('languageObject').toJS()}>
				<StyleRoot>
					<Helmet {...metaData} />

					<AppBody
						appData={this.props.appData}
						loginData={this.props.loginData}
						pubData={this.props.pubData}
						path={this.props.path}
						slug={this.props.slug}
						children={this.props.children}
						dispatch={this.props.dispatch} />
				</StyleRoot>
			</IntlProvider>
		);
	}

});

export default connect( state => {
	return {
		appData: state.app,
		loginData: state.login,
		pubData: state.pub,
		path: state.router.location.pathname,
		slug: state.router.params.slug,
	};
})( App );
