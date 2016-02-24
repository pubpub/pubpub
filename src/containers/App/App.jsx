import React, { PropTypes } from 'react';
import {StyleRoot} from 'radium';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {loadJournalAndLogin} from '../../actions/journal';
import {AppBody} from '../';


import {IntlProvider} from 'react-intl';


const App = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		languageData: PropTypes.object,
		loginData: PropTypes.object,
		navData: PropTypes.object,
		pubData: PropTypes.object,
		path: PropTypes.string,
		slug: PropTypes.string,
		children: PropTypes.object.isRequired,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch) {
			if (getState().journal.get('status') === 'loading') {
				return dispatch(loadJournalAndLogin());				
			}
			return ()=>{};		
		}
	},

	render: function() {
		const journalURL = this.props.journalData.getIn(['journalData', 'customDomain']) ? 'http://' + this.props.journalData.getIn(['journalData', 'customDomain']) : 'http://' + this.props.journalData.getIn(['journalData', 'subdomain']) + '.pubpub.org';
		const currentBaseURL = this.props.journalData.get('baseSubdomain') ? journalURL : 'http://www.pubpub.org';
		const rootImage = this.props.journalData.getIn(['journalData', 'journalLogoURL']) ? this.props.journalData.getIn(['journalData', 'journalLogoURL']) : 'https://s3.amazonaws.com/pubpub-upload/pubpubDefaultTitle.png';
		const metaData = {
			meta: [
				{name: 'description', content: 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.'},
				{property: 'og:site_name', content: 'PubPub'},
				{property: 'og:title', content: this.props.journalData.get('baseSubdomain') ? this.props.journalData.getIn(['journalData', 'journalName']) : 'PubPub'},
				{property: 'og:description', content: 'PubPub is a platform for totally transparent publishing. Read, Write, Publish, Review.'},
				{property: 'og:url', content: currentBaseURL + this.props.path},
				{property: 'og:type', content: 'website'},
				{property: 'og:image', content: rootImage},
				{property: 'fb:app_id', content: '924988584221879'},
			]
		};
		
		return (
			
			<IntlProvider locale={'en'} messages={this.props.languageData.get('languageObject').toJS()}>
				<StyleRoot>
					<Helmet {...metaData} />

					<AppBody 
						journalData={this.props.journalData}
						languageData={this.props.languageData}
						loginData={this.props.loginData}
						navData={this.props.navData}
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
		journalData: state.journal,
		languageData: state.language,
		loginData: state.login, 
		navData: state.nav,
		pubData: state.pub,
		path: state.router.location.pathname,
		slug: state.router.params.slug,
	};
})( App );
