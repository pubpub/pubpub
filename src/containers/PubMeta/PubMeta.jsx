import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {getPub, pubNavIn} from '../../actions/pub';
// import {toggleVisibility} from '../../actions/login';
import {submitPubToJournal} from '../../actions/journal';
import {inviteReviewers} from '../../actions/user';
import { Link } from 'react-router';
import {PubLeftBar, PubNav, LoaderDeterminate} from '../../components';
import {Discussions} from '../../containers';
// import {PubMetaDiscussions, PubMetaExperts, PubMetaHistory, PubMetaHistoryDiff, PubMetaReview, PubMetaReviews, PubMetaSource} from '../../components/PubMetaPanels';
import {PubMetaAnalytics, PubMetaCitations, PubMetaHistory, PubMetaHistoryDiff, PubMetaInTheNews, PubMetaInvite, PubMetaJournals, PubMetaSource} from '../../components/PubMetaPanels';
import {globalStyles, pubSizes} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubMeta = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		inviteStatus: PropTypes.string,
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		slug: PropTypes.string,
		meta: PropTypes.string,
		metaID: PropTypes.string,
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
			document.getElementsByClassName('centerBar')[0].scrollTop = 0;
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

		const metaData = {};
		if (this.props.readerData.getIn(['pubData', 'title'])) {
			metaData.title = 'PubPub - ' + this.props.readerData.getIn(['pubData', 'title']);
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}

		// const pubData = this.props.readerData.get('pubData').toJS();
		const versionIndex = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
		const versionURL = this.props.query.version !== undefined ? '?version=' + this.props.query.version : '';
		
		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					{!pubData.history[0].markdown
						? null
						: <PubLeftBar
							slug={this.props.slug}
							query={this.props.query}
							pubStatus={pubData.status}
							readRandomPubHandler={this.readRandomPub}
							randomSlug={this.props.journalData.getIn(['journalData', 'randomSlug'])}
							journalCount={pubData.featuredInList ? pubData.featuredInList.length : 0}
							historyCount={pubData.history ? pubData.history.length : 0}
							analyticsCount={pubData.views ? pubData.views : 0}
							citationsCount={pubData.citations ? pubData.citations.length : 0}
							newsCount={pubData.news ? pubData.news.length : 0} />
					}
					
				</div>

				<div className="centerBar" style={[styles.centerBar]}>
					<PubNav
						height={this.height}
						status={this.props.readerData.get('status')}
						slug={this.props.slug}
						meta={this.props.meta}
						query={this.props.query}/>

					<LoaderDeterminate
						value={this.props.readerData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[styles.centerContent, styles[this.props.readerData.get('status')]]}>
						{!pubData.history[0].markdown
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
												historyData={this.props.readerData.getIn(['pubData', 'history']).toJS()}
												slug={this.props.slug}/>
											);
									case 'journals':
										return (<PubMetaJournals
												featuredIn={this.props.readerData.getIn(['pubData', 'featuredIn']).toJS()}
												featuredInList={this.props.readerData.getIn(['pubData', 'featuredInList']).toJS()}
												submittedTo={this.props.readerData.getIn(['pubData', 'submittedTo']).toJS()}
												submittedToList={this.props.readerData.getIn(['pubData', 'submittedToList']).toJS()}
												handleSubmitToJournal={this.submitToJournal}
												isAuthor={this.props.readerData.getIn(['pubData', 'isAuthor'])}/>
											);
									case 'source':
										return (<PubMetaSource
												historyObject={this.props.readerData.getIn(['pubData', 'history', versionIndex]).toJS()}/>
											);
									case 'historydiff':
										return (<PubMetaHistoryDiff
												diffObject={this.props.readerData.getIn(['pubData', 'history', versionIndex, 'diffObject']).toJS()}/>
											);
									case 'discussions':
										return <Discussions editorCommentMode={false} metaID={this.props.metaID} />;
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
									case 'news':
										return (
											<PubMetaInTheNews />
										);
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

export default connect( state => {
	return {
		readerData: state.pub,
		loginData: state.login,
		journalData: state.journal,
		slug: state.router.params.slug,
		meta: state.router.params.meta,
		metaID: state.router.params.metaID,
		query: state.router.location.query,
		inviteStatus: state.user.get('inviteStatus')
	};
})( Radium(PubMeta) );

styles = {
	container: {
		width: '100%',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		backgroundColor: globalStyles.sideBackground,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			maxWidth: '100%',
			height: 'auto'
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			// backgroundColor: 'red',
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			// backgroundColor: 'orange',
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			// backgroundColor: 'yellow',
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			// backgroundColor: 'green',
		},
		'@media screen and (min-width: 2000px)': {
			// backgroundColor: 'blue',
		},

	},
	leftBar: {
		padding: 5,
		width: 'calc(150px - 10px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 10px)',
		marginRight: 650,
		float: 'left',
		transition: '.3s linear opacity .25s',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: 'Lato',
		color: globalStyles.sideText,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			padding: pubSizes.xSmallLeftBarPadding,
			width: 'calc(' + pubSizes.xSmallLeft + 'px - ' + (2 * pubSizes.xSmallLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xSmallLeftBarPadding) + 'px)',
			marginRight: pubSizes.xSmallPubMeta
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallLeftBarPadding,
			width: 'calc(' + pubSizes.smallLeft + 'px - ' + (2 * pubSizes.smallLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallLeftBarPadding) + 'px)',
			marginRight: pubSizes.smallPubMeta
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumLeftBarPadding,
			width: 'calc(' + pubSizes.mediumLeft + 'px - ' + (2 * pubSizes.mediumLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumLeftBarPadding) + 'px)',
			marginRight: pubSizes.mediumPubMeta
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largeLeftBarPadding,
			width: 'calc(' + pubSizes.largeLeft + 'px - ' + (2 * pubSizes.largeLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largeLeftBarPadding) + 'px)',
			marginRight: pubSizes.largePubMeta
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargeLeftBarPadding,
			width: 'calc(' + pubSizes.xLargeLeft + 'px - ' + (2 * pubSizes.xLargeLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xLargeLeftBarPadding) + 'px)',
			marginRight: pubSizes.xLargePubMeta
		},


	},
	centerContent: {
		transition: '.3s linear opacity .25s',
		padding: 15,
		fontFamily: globalStyles.headerFont,
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
		width: 'calc(100% - 150px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		position: 'absolute',
		top: '0px',
		left: 150,
		float: 'left',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)',
		zIndex: 10,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			// height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
			height: 'auto',
			position: 'relative',
			overflow: 'hidden',
			float: 'none',
			zIndex: 'auto',
			top: 0,
			left: 0,
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			width: pubSizes.xSmallPubMeta,
			left: pubSizes.xSmallLeft,
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			width: pubSizes.smallPubMeta,
			left: pubSizes.smallLeft,
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			width: pubSizes.mediumPubMeta,
			left: pubSizes.mediumLeft,
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			width: pubSizes.largePubMeta,
			left: pubSizes.largeLeft,
		},
		'@media screen and (min-width: 2000px)': {
			width: pubSizes.xLargePubMeta,
			left: pubSizes.xLargeLeft,
		},
	},
	centerBarModalActive: {
		pointerEvents: 'none',
		overflowY: 'hidden',
	},

	rightBar: {
		padding: 5,
		width: 'calc(100% - 800px - 10px)',
		display: 'none',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 10px)',
		float: 'left',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: 'Lato',
		transition: '.3s linear opacity .25s',
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			padding: pubSizes.xSmallPadding,
			width: 'calc(100% - ' + pubSizes.xSmallLeft + 'px - ' + pubSizes.xSmallPubMeta + 'px - ' + (2 * pubSizes.xSmallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xSmallPadding) + 'px)',
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallPadding,
			width: 'calc(100% - ' + pubSizes.smallLeft + 'px - ' + pubSizes.smallPubMeta + 'px - ' + (2 * pubSizes.smallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallPadding) + 'px)',
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumPadding,
			width: 'calc(100% - ' + pubSizes.mediumLeft + 'px - ' + pubSizes.mediumPubMeta + 'px - ' + (2 * pubSizes.mediumPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumPadding) + 'px)',
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largePadding,
			width: 'calc(100% - ' + pubSizes.largeLeft + 'px - ' + pubSizes.largePubMeta + 'px - ' + (2 * pubSizes.largePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largePadding) + 'px)',
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargePadding,
			width: 'calc(100% - ' + pubSizes.xLargeLeft + 'px - ' + pubSizes.xLargePubMeta + 'px - ' + (2 * pubSizes.xLargePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xLargePadding) + 'px)',
		},
	},
	loading: {
		opacity: 0,
	},
	loaded: {
		opacity: 1
	},

	versionNotification: {
		textAlign: 'center',
		backgroundColor: globalStyles.sideBackground,
		padding: 20,
		margin: 5,
		fontFamily: globalStyles.headerFont,
		color: globalStyles.sideText,
		userSelect: 'none',
		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '20px',
		},

	},
};
