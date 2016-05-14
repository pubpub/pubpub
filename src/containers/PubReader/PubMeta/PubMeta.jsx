import React, { PropTypes } from 'react';
// import {connect} from 'react-redux';
import Radium from 'radium';
// import Helmet from 'react-helmet';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {getPub, pubNavIn} from 'containers/PubReader/actions';
// import {toggleVisibility} from 'actions/login';
import {submitPubToJournal} from 'containers/JournalProfile/actions';
import {inviteReviewers} from 'containers/UserProfile/actions';
import { Link } from 'react-router';
// import {PubLeftBar, PubNav, LoaderDeterminate} from 'components';
import {Discussions} from 'containers';

// import {PubMetaAnalytics, PubMetaCitations, PubMetaHistory, PubMetaHistoryDiff, PubMetaInTheNews, PubMetaInvite, PubMetaJournals, PubMetaSource} from './components';
import PubMetaAnalytics from './PubMetaAnalytics';
import PubMetaCitations from './PubMetaCitations';
import PubMetaHistory from './PubMetaHistory';
import PubMetaHistoryDiff from './PubMetaHistoryDiff';
import PubMetaInvite from './PubMetaInvite';
import PubMetaJournals from './PubMetaJournals';
import PubMetaSource from './PubMetaSource';

import {globalStyles} from 'utils/styleConstants';
import {safeGetInToJS} from 'utils/safeParse';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubMeta = React.createClass({
	propTypes: {
		readerData: PropTypes.object,

		loginData: PropTypes.object,
		slug: PropTypes.string,
		meta: PropTypes.string,
		metaID: PropTypes.string,
		inviteStatus: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	mixins: [PureRenderMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			if (getState().pub.getIn(['pubData', 'slug']) !== routeParams.slug) {
				return dispatch(getPub(routeParams.slug));
			}
			return dispatch(pubNavIn());
		}
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.meta !== nextProps.meta) {
			// document.getElementsByClassName('centerBar')[0].scrollTop = 0;
		}
	},

	// componentWillUnmount() {
	// 	this.props.dispatch(pubNavOut());
	// },

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.2s linear transform'
		};
	},

	// addDiscussion: function(discussionObject, activeSaveID) {
	// 	if (!this.props.loginData.get('loggedIn')) {
	// 		return this.props.dispatch(toggleVisibility());
	// 	}
	// 	discussionObject.pub = this.props.readerData.getIn(['pubData', '_id']);
	// 	discussionObject.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.readerData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.readerData.getIn(['pubData', 'history']).size;
	// 	discussionObject.selections = this.props.readerData.getIn(['newDiscussionData', 'selections']);
	// 	this.props.dispatch(addDiscussion(discussionObject, activeSaveID));
	// },

	// discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
	// 	if (!this.props.loginData.get('loggedIn')) {
	// 		return this.props.dispatch(toggleVisibility());
	// 	}
	// 	this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
	// },

	submitToJournal: function(journalData) {
		this.props.dispatch(submitPubToJournal(this.props.readerData.getIn(['pubData', '_id']), journalData));
	},

	submitInvites: function(inviteData) {
		return this.props.dispatch(inviteReviewers(this.props.readerData.getIn(['pubData', '_id']), inviteData));
	},

	render: function() {
		const pubData = this.props.readerData.get('pubData').toJS();

		const featuredIn = safeGetInToJS(this.props.readerData, ['pubData', 'featuredIn']) || [];
		const featuredInList = safeGetInToJS(this.props.readerData, ['pubData', 'featuredInList']) || [];
		const submittedTo = safeGetInToJS(this.props.readerData, ['pubData', 'submittedTo']) || [];
		const submittedToList = safeGetInToJS(this.props.readerData, ['pubData', 'submittedToList']) || [];
		const historyData = safeGetInToJS(this.props.readerData, ['pubData', 'history']) || [];

		// console.log(historyData);

		// const pubData = this.props.readerData.get('pubData').toJS();
		const versionIndex = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
		const versionURL = this.props.query.version !== undefined ? '?version=' + this.props.query.version : '';

		return (
			<div style={styles.container}>

				<div className="centerBar" style={[styles.centerBar]}>

					<div style={[styles.centerContent, styles[this.props.readerData.get('status')]]}>
						{pubData.history[0] && !pubData.history[0].markdown
							? <div style={styles.metaTitle}><span style={styles.metaTitleType}>{pubData.history[0].title}</span></div>
							: <div>
								<div style={styles.metaTitle}>
									{this.props.meta && globalMessages[this.props.meta]
										? <span style={styles.metaTitleType}><FormattedMessage {...globalMessages[this.props.meta]} />:</span>
										: null
									}
									<Link to={'/pub/' + this.props.slug + versionURL} key={'metaTitleLink'} style={globalStyles.link}><span style={styles.metaTitlePub}>{this.props.readerData.getIn(['pubData', 'title'])}</span></Link>

								</div>

								{(() => {
									switch (this.props.meta) {
									case 'history':
										return (<PubMetaHistory
												historyData={historyData}
												slug={this.props.slug}/>
											);
									case 'journals':
										return (<PubMetaJournals
												featuredIn={featuredIn}
												featuredInList={featuredInList}
												submittedTo={submittedTo}
												submittedToList={submittedToList}
												handleSubmitToJournal={this.submitToJournal}
												isAuthor={this.props.readerData.getIn(['pubData', 'isAuthor'])}/>
											);
									case 'source':
										return (<PubMetaSource
												historyObject={this.props.readerData.getIn(['pubData', 'history', versionIndex]).toJS()}/>
											);
									case 'historydiff':
										return (<PubMetaHistoryDiff
												diffObject={this.props.readerData.getIn(['pubData', 'history', versionIndex, 'diffObject']) && this.props.readerData.getIn(['pubData', 'history', versionIndex, 'diffObject']).toJS && this.props.readerData.getIn(['pubData', 'history', versionIndex, 'diffObject']).toJS()}/>
											);
									case 'discussions':
										return <Discussions metaID={this.props.metaID} />;
										// return (<PubMetaDiscussions
										// 	metaID={this.props.metaID}
										// 	slug={this.props.slug}
										// 	discussionsData={this.props.readerData.getIn(['pubData', 'discussions']).toJS()}

										// 	addDiscussionHandler={this.addDiscussion}
										// 	addDiscussionStatus={this.props.readerData.get('addDiscussionStatus')}
										// 	newDiscussionData={this.props.readerData.get('newDiscussionData')}
										// 	activeSaveID={this.props.readerData.get('activeSaveID')}
										// 	userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
										// 	handleVoteSubmit={this.discussionVoteSubmit} />
										// 	);
									case 'invite':
										return (
											<PubMetaInvite
												handleSubmitInvites={this.submitInvites}
												inviteStatus={this.props.inviteStatus}
												/>
										);
									case 'citations':
										return (
											<PubMetaCitations />
										);
									case 'analytics':
										return (
											<PubMetaAnalytics />
										);
									// case 'news':
									// 	return (
									// 		<PubMetaInTheNews />
									// 	);
									// case 'reviews':
									// 	return (<PubMetaReviews />
									// 		);
									// case 'review':
									// 	return (<PubMetaReview />
									// 		);

									default:
										return null;
									}
								})()}
							</div>
						}


					</div>


				</div>

			</div>
		);
	}

});

export default Radium(PubMeta) ;

styles = {
	container: {

	},

	metaTitle: {
		marginBottom: '25px',
	},
	metaTitleType: {
		color: '#444',
		paddingRight: 10,
		fontSize: '35px',
		textTransform: 'lowercase',
	},
	metaTitlePub: {
		color: '#888',
		fontSize: '24px',
		':hover': {
			color: '#000',
		}
	},
	centerBar: {
		backgroundColor: 'white',
		boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)',
		minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ' + 3px)',
	},


};
