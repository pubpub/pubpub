import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {getJournal} from '../../actions/journal';
import {LoaderDeterminate} from '../../components';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

let styles = {};

const JournalAdmin = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			// If it's not pubpub.org, don't fetch
			// If it's pubpub, fetch if it doesn't match 
			// We only need to fetch data if we're on pubpub.org and the journal we're looking at doesn't match the one we already loaded.
			// If we're in a journal, there shouldn't be a subdomain value. If there is, we display an error
			if (routerParams.subdomain && getState().journal.getIn(['journalData', 'subdomain']) !== routerParams.subdomain && (window.location.hostname === 'localhost' || window.location.hostname === 'www.pbpb.co' || window.location.hostname === 'www.pubpub.org')) {
				return dispatch(getJournal(routerParams.subdomain));
			}
		}
	},

	render: function() {
		const metaData = {};
		metaData.title = 'Journal';

		return (
			<div style={profileStyles.profilePage}>

				<DocumentMeta {...metaData} />

				
				<div style={profileStyles.profileWrapper}>
					
					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')]]}>
						<ul style={navStyles.navList}>
							<li key="journalNav0" style={[navStyles.navItem, true && navStyles.navItemShow]}>Settings</li>
							<li style={[navStyles.navSeparator, true && navStyles.navItemShow]}></li>

							<li key="journalNav1" style={[navStyles.navItem, true && navStyles.navItemShow]}>Design</li>
							<li style={[navStyles.navSeparator, true && navStyles.navItemShow]}></li>

							<li key="journalNav2" style={[navStyles.navItem, true && navStyles.navItemShow]}>Pubs</li>
							<li style={[navStyles.navSeparator, true && navStyles.navItemShow, navStyles.navSeparatorNoMobile]}></li>
						</ul>
					</div>
					
					<LoaderDeterminate value={this.props.journalData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')], styles.contentWrapper]}>
						<h1>Journal Admin</h1>
						{JSON.stringify(this.props.journalData.get('journalData').toJS())}
					</div>

				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		journalData: state.journal, 
	};
})( Radium(JournalAdmin) );

styles = {
	contentWrapper: {
		margin: globalStyles.headerHeight,
	}
};
