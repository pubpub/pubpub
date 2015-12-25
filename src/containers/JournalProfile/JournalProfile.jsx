import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {getJournal, saveJournal} from '../../actions/journal';
import {LoaderDeterminate, JournalCurate, JournalDesign, JournalMain, JournalSettings} from '../../components';
import {NotFound} from '../../containers';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

let styles = {};

const JournalAdmin = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		subdomain: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			// If there is a baseSubdomain, that means we're on a journal. If baseSubdomain is null, that means we're on pubpub. 
			// Only fetch if we're on pubpub - otherwise, the journalData we display is the data for that journal. 
			// Elsewhere, we render default pubpub styling by checking for null baseSubdomain (or maybe it's sourced from the backend, with null kept as subdomain field)
			if (getState().journal.get('baseSubdomain') === null && getState().journal.getIn(['journalData', 'subdomain']) !== routerParams.subdomain) {
				return dispatch(getJournal(routerParams.subdomain));
			}
			return ()=>{};	
		}
	},

	journalSave: function(key, newObject) {
		this.props.dispatch(saveJournal(this.props.subdomain, key, newObject));
	},

	render: function() {
		const metaData = {};
		metaData.title = 'Journal';

		return (
			<div style={profileStyles.profilePage}>

				<DocumentMeta {...metaData} />

				{
					(this.props.subdomain !== this.props.journalData.get('baseSubdomain') && this.props.journalData.get('baseSubdomain') !== null) || (this.props.mode && !this.props.journalData.getIn(['journalData', 'isAdmin']))
						? <NotFound />
						: <div style={profileStyles.profileWrapper}>
					
							<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')]]}>
								<ul style={navStyles.navList}>
									<Link to={'/journal/' + this.props.subdomain + '/settings'} style={globalStyles.link}><li key="journalNav0" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>Settings</li></Link>
									<li style={[navStyles.navSeparator, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li>

									<Link to={'/journal/' + this.props.subdomain + '/design'} style={globalStyles.link}><li key="journalNav1" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>Design</li></Link>
									<li style={[navStyles.navSeparator, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li>

									<Link to={'/journal/' + this.props.subdomain + '/curate'} style={globalStyles.link}><li key="journalNav2" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>Curate</li></Link>
									<li style={[navStyles.navSeparator, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow, navStyles.navSeparatorNoMobile]}></li>

									<li key="journalNav3" style={[navStyles.navItem, !this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>Follow</li>
									<li style={[navStyles.navSeparator, !this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li>
								</ul>
							</div>
							
							<LoaderDeterminate value={this.props.journalData.get('status') === 'loading' ? 0 : 100}/>

							<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')], styles.contentWrapper]}>
								
								<div>
									<Link to={'/journal/' + this.props.subdomain} style={globalStyles.link}>
										<span style={styles.headerJournalName} key={'headerJournalName'}>{this.props.journalData.getIn(['journalData', 'journalName'])}</span>
									</Link>
									<span style={[styles.headerMode, this.props.mode && styles.headerModeShow]}>: {this.props.mode}</span>
								</div>
								<div style={styles.journalProfileContent}>
									{() => {
										switch (this.props.mode) {
										case 'curate':
											return (
												<JournalCurate />
											);
										case 'design':
											return (
												<JournalDesign 
													designObject={this.props.journalData.getIn(['journalData', 'design']) ? this.props.journalData.getIn(['journalData', 'design']).toJS() : {}}
													journalSaving={this.props.journalData.get( 'journalSaving')}
													journalSaveHandler={this.journalSave}/>
											);
										case 'settings':
											return (
												<JournalSettings />
											);
										
										default:
											return (
												<JournalMain />
											);
										}
									}()}
								</div>
								

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
		subdomain: state.router.params.subdomain,
		mode: state.router.params.mode
	};
})( Radium(JournalAdmin) );

styles = {
	contentWrapper: {
		margin: globalStyles.headerHeight,
	},
	headerJournalName: {
		color: globalStyles.sideText,
		fontSize: 35,
		':hover': {
			color: 'black',
		},
	},
	headerMode: {
		color: '#888',
		fontSize: 25,
		display: 'none',
	},
	headerModeShow: {
		display: 'inline',
	},
	journalProfileContent: {
		marginLeft: 10,
	},

};

// const output = [
// 	block: {
// 		render: function(){return <Block text={text}/>}
// 		text: undefined,
// 		link: undefined,
// 		style: {},
// 	},
// 	image: {
// 		render: function(){return <Block text={text}/>}
// 		image: undefined,
// 		link: undefined,
// 		style: {},
// 	},
// 	search: {
// 		render: function(){return <Block text={text}/>}
// 		text: undefined,
// 		style: {},
// 	},

// ];
