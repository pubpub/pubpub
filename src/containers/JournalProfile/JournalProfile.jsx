import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getJournal, saveJournal, createCollection, clearCollectionRedirect} from '../../actions/journal';
import {follow, unfollow, toggleVisibility} from '../../actions/login';
import {LoaderDeterminate, JournalCurate, JournalDesign, JournalMain, JournalSettings} from '../../components';
import {NotFound} from '../../containers';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

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

	componentWillReceiveProps(nextProps) {
		if (nextProps.journalData.get('createCollectionStatus') === 'created') {
			this.props.dispatch(pushState(null, ('/collection/' + nextProps.journalData.get('createCollectionSlug') + '/draft')));
			this.props.dispatch(clearCollectionRedirect());
		}
	},

	journalSave: function(newObject) {
		this.props.dispatch(saveJournal(this.props.subdomain, newObject));
	},

	createCollection: function(newCollectionObject) {
		this.props.dispatch(createCollection(this.props.subdomain, newCollectionObject));
	},

	followJournalToggle: function() {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		const analyticsData = {
			type: 'pubs',
			followedID: this.props.journalData.getIn(['journalData', '_id']),
			journalName: this.props.journalData.getIn(['journalData', 'journalName']),
			subdomain: this.props.journalData.getIn(['journalData', 'subdomain']),
			customDomain: this.props.journalData.getIn(['journalData', 'customDomain']),
			numPubsFeatured: this.props.journalData.getIn(['journalData', 'pubsFeatured']) ? this.props.journalData.getIn(['journalData', 'pubsFeatured']).size : 0,
			numPubsSubmitted: this.props.journalData.getIn(['journalData', 'pubsSubmitted']) ? this.props.journalData.getIn(['journalData', 'pubsSubmitted']).size : 0,
			numFollowers: this.props.journalData.getIn(['journalData', 'followers']) ? this.props.journalData.getIn(['journalData', 'followers']).size : 0,
			numAdmins: this.props.journalData.getIn(['journalData', 'admins']) ? this.props.journalData.getIn(['journalData', 'admins']).size : 0,
		};

		const isFollowing = this.props.loginData.getIn(['userData', 'following', 'journals']) ? this.props.loginData.getIn(['userData', 'following', 'journals']).indexOf(this.props.journalData.getIn(['journalData', '_id'])) > -1 : false;
		
		if (isFollowing) {
			this.props.dispatch( unfollow('journals', this.props.journalData.getIn(['journalData', '_id']), analyticsData) );
		} else {
			this.props.dispatch( follow('journals', this.props.journalData.getIn(['journalData', '_id']), analyticsData) );
		}
	},

	render: function() {
		const metaData = {};
		metaData.title = 'Journal';

		return (
			<div style={profileStyles.profilePage}>

				<Helmet {...metaData} />

				{
					(this.props.subdomain !== this.props.journalData.get('baseSubdomain') && this.props.journalData.get('baseSubdomain') !== null) || (this.props.mode && !this.props.journalData.getIn(['journalData', 'isAdmin']))
						? <NotFound />
						: <div style={profileStyles.profileWrapper}>
					
							<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')]]}>
								<ul style={navStyles.navList}>
									<Link to={'/journal/' + this.props.subdomain + '/settings'} style={globalStyles.link}><li key="journalNav0" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>
										<FormattedMessage {...globalMessages.settings} />
									</li></Link>
									<li style={[navStyles.navSeparator, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li>

									<Link to={'/journal/' + this.props.subdomain + '/design'} style={globalStyles.link}><li key="journalNav1" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>
										<FormattedMessage {...globalMessages.design} />
									</li></Link>
									<li style={[navStyles.navSeparator, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li>

									<Link to={'/journal/' + this.props.subdomain + '/curate'} style={globalStyles.link}><li key="journalNav2" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>
										<FormattedMessage {...globalMessages.curate} />
									</li></Link>
									<li style={[navStyles.navSeparator, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow, navStyles.noMobile]}></li>

									<li key="journalNav3" style={[navStyles.navItem, !this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]} onClick={this.followJournalToggle}>
										{this.props.loginData.getIn(['userData', 'following', 'journals']) && this.props.loginData.getIn(['userData', 'following', 'journals']).indexOf(this.props.journalData.getIn(['journalData', '_id'])) > -1 
											? <FormattedMessage {...globalMessages.following} />
											: <FormattedMessage {...globalMessages.follow} />
										}
									</li>
									<li style={[navStyles.navSeparator, !this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li>
								</ul>
							</div>
							
							<LoaderDeterminate value={this.props.journalData.get('status') === 'loading' ? 0 : 100}/>

							<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')], styles.contentWrapper]}>
								
								<div>
									<Link to={'/journal/' + this.props.subdomain} style={globalStyles.link}>
										<span style={styles.headerJournalName} key={'headerJournalName'}>{this.props.journalData.getIn(['journalData', 'journalName'])}</span>
									</Link>
									{this.props.mode
										? <span style={styles.headerMode}>: <FormattedMessage {...globalMessages[this.props.mode]} /></span>
										: null

									}
								</div>
								<div style={styles.journalProfileContent}>
									{(() => {
										switch (this.props.mode) {
										case 'curate':
											return (
												<JournalCurate 
													journalData={this.props.journalData.get('journalData').toJS()}
													journalSaving={this.props.journalData.get('journalSaving')}
													journalSaveHandler={this.journalSave}
													createCollectionHandler={this.createCollection}
													createCollectionStatus={this.props.journalData.get('createCollectionStatus')}/>
											);
										case 'design':
											return (
												<JournalDesign 
													designObject={this.props.journalData.getIn(['journalData', 'design']) ? this.props.journalData.getIn(['journalData', 'design']).toJS() : {}}
													journalSaving={this.props.journalData.get( 'journalSaving')}
													journalSaveHandler={this.journalSave}
													journalData={this.props.journalData}/>
											);
										case 'settings':
											return (
												<JournalSettings 
													journalData={this.props.journalData.get('journalData').toJS()}
													journalSaving={this.props.journalData.get( 'journalSaving')}
													journalSaveHandler={this.journalSave}/>
											);
										
										default:
											return (
												<JournalMain 
													journalData={this.props.journalData.get('journalData').toJS()}/>
											);
										}
									})()}
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
