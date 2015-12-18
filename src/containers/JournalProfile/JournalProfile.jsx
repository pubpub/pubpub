import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {getJournal} from '../../actions/journal';
import {LoaderDeterminate} from '../../components';
import {NotFound} from '../../containers';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

let styles = {};

const JournalAdmin = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		subdomain: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			// If there is a baseSubdomain, that means we're on a journal. If baseSubdomain is null, that means we're on pubpub. 
			// Only fetch if we're on pubpub - otherwise, the journalData we display is the data for that journal. 
			// Elsewhere, we render default pubpub styling by checking for null baseSubdomain (or maybe it's sourced from the backend, with null kept as subdomain field)
			if (getState().journal.get('baseSubdomain') === null) {
				console.log('were trying to fetch!');
				return dispatch(getJournal(routerParams.subdomain));
			}
			console.log('we did not fetch');
			return ()=>{};	
		}
	},

	render: function() {
		const metaData = {};
		metaData.title = 'Journal';
		return (
			<div style={profileStyles.profilePage}>

				<DocumentMeta {...metaData} />

				{
					this.props.subdomain !== undefined && this.props.journalData.get('baseSubdomain') !== null
						? <NotFound />
						: <div style={profileStyles.profileWrapper}>
					
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
								{JSON.stringify(this.props.journalData.get('journalData'))}
							</div>

						</div>
				}
								
			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		journalData: state.journal, 
		subdomain: state.router.params.subdomain
	};
})( Radium(JournalAdmin) );

styles = {
	contentWrapper: {
		margin: globalStyles.headerHeight,
	}
};
