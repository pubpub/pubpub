import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
// import {globalStyles} from 'utils/styleConstants';
import {rightBarStyles} from 'containers/PubReader/rightBarStyles';
import DiscussionsItem from './DiscussionsItem';
import DiscussionsInput from './DiscussionsInput';

import {toggleVisibility} from 'actions/login';
import {addDiscussion, discussionVoteSubmit, togglePubHighlights, archiveDiscussion} from 'actions/discussions';

import {redditHot as hotScore} from 'decay';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const Discussions = React.createClass({
	propTypes: {
		metaID: PropTypes.string,
		// editorCommentMode: PropTypes.bool,
		// inEditor: PropTypes.bool,
		// instanceName: PropTypes.string,

		discussionData: PropTypes.object,
		pubData: PropTypes.object,
		// editorData: PropTypes.object,
		loginData: PropTypes.object,
		journalData: PropTypes.object,

		slug: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,

		dispatch: PropTypes.func,

	},

	// getDefaultProps: function() {
	// 	return {
	// 		editorCommentMode: false,
	// 		inEditor: false,
	// 	};
	// },

	addDiscussion: function(discussionObject, activeSaveID) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		// console.log(discussionObject);
		if (!discussionObject.markdown) {
			return null;
		}

		const pathname = this.props.pathname;

		if (pathname.substring(pathname.length-6, pathname.length) === '/draft') {
			// We are commenting from the draft, so mark it so.
			discussionObject.version = 0;
		} else {
			discussionObject.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.pubData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.pubData.getIn(['pubData', 'history']).size;
		}
		discussionObject.pub = this.props.pubData.getIn(['pubData', '_id']);

		discussionObject.sourceJournal = this.props.journalData.getIn(['journalData', '_id']);

		this.props.dispatch(addDiscussion(discussionObject, activeSaveID, this.props.inEditor));
	},

	discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		// if (this.props.editorCommentMode) {
		// 	this.props.dispatch(discussionVoteSubmitEditor(type, discussionID, userYay, userNay));
		// } else {
		this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
		// }
	},

	toggleHighlights: function() {
		this.props.dispatch(togglePubHighlights());
	},


	filterDiscussions: function(discussionsData) {
		function findDiscussionRoot(discussions, searchID) {
			for (let index = 0; index < discussions.length; index++) {
				if (discussions[index]._id === searchID) {
					return discussions[index];
				} else if (discussions[index].children && discussions[index].children.length) {
					const foundChild = findDiscussionRoot(discussions[index].children, searchID);
					if (foundChild) {
						return foundChild;
					}
				}
			}
		}

		// const pubData = this.getDiscussionData();
		const output = [findDiscussionRoot(discussionsData, this.props.metaID)];
		return output;
	},

	// getDiscussionData: function() {
	// 	// Point to the right state source
	// 	// let pubData = {};
	// 	// // if (this.props.inEditor) {
	// 	// // 	pubData = this.props.editorData.get('pubEditData') && this.props.editorData.get('pubEditData').toJS ? this.props.editorData.get('pubEditData').toJS() : {};
	// 	// // } else {
	// 	// pubData = this.props.pubData.get('pubData') && this.props.pubData.get('pubData').toJS ? this.props.pubData.get('pubData').toJS() : {};
	// 	// // }
	// 	//
	// 	// // Point to the right list of discssion items
	// 	// let discussionsData = [];
	// 	// if (this.props.editorCommentMode) {
	// 	// 	discussionsData = pubData.editorComments;
	// 	// } else {
	// 	// 	discussionsData = pubData.discussions;
	// 	// }
	// 	// Filter the items if we have a metaID
	//
	// 	return discussionsData;
	// },

	archiveDiscussion: function(objectID) {
		if (this.props.editorCommentMode) {
			this.props.dispatch(archiveComment(objectID));
		} else {
			this.props.dispatch(archiveDiscussion(objectID));
		}
	},

	getHotness: function(discussion) {

		// let points = (discussion.points) ? discussion.points : 0;
		// points = Math.max(points, 0);

		const yays = (discussion.yays) ? discussion.yays : 0;
		const nays = (discussion.nays) ? discussion.nays : 0;

		const timestamp = (discussion.postDate) ? new Date(discussion.postDate) : new Date(0);

		return hotScore(yays, nays, timestamp);
	},

	render: function() {
		// const pubData = {discussions: []};

		let discussionsData = this.props.discussionsData.get('discussions') || [];
		discussionsData = this.props.metaID ? this.filterDiscussions(discussionsData) : discussionsData;

		const addDiscussionStatus = this.props.discussionsData.get('addDiscussionStatus');
		const newDiscussionData = this.props.discussionsData.get('newDiscussionData');
		const activeSaveID = this.props.discussionsData.get('activeSaveID');
		const isPubAuthor = this.props.pubData.getIn(['pubData', 'isAuthor']);

		discussionsData.sort(function(a, b) { return this.getHotness(b) - this.getHotness(a); }.bind(this));

		return (
			<div style={styles.container}>

				<Style rules={{
					'.pub-discussions-wrapper .p-block': {
						padding: '0.5em 0em',
					}
				}} />

				<div className="pub-discussions-wrapper" style={styles.sectionWrapper}>
					{this.props.pubData.getIn(['pubData', 'referrer', 'name'])
						? <div>{this.props.pubData.getIn(['pubData', 'referrer', 'name'])} invites you to comment!</div>
						: null
					}

					{this.props.metaID
						? null
						: <DiscussionsInput
							addDiscussionHandler={this.addDiscussion}
							addDiscussionStatus={addDiscussionStatus}
							newDiscussionData={newDiscussionData}
							userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
							activeSaveID={activeSaveID}
							saveID={'root'}
							isReply={false}
							codeMirrorID={this.props.instanceName + 'rootCommentInput'}/>
					}

					{
						discussionsData.map((discussion)=>{
							// console.log(discussion);
							return (discussion
								? <DiscussionsItem
									key={discussion._id}
									slug={this.props.slug}
									discussionItem={discussion}
									isPubAuthor={isPubAuthor}

									activeSaveID={activeSaveID}
									addDiscussionHandler={this.addDiscussion}
									addDiscussionStatus={addDiscussionStatus}
									newDiscussionData={newDiscussionData}
									userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
									handleVoteSubmit={this.discussionVoteSubmit}
									handleArchive={this.archiveDiscussion} />

								: <div style={styles.emptyContainer}>No Discussions Found</div>
							);
						})
					}

					{(discussionsData.length === 0) ?
						<div style={styles.emptyComments}>
							<div>There are no comments here yet.</div>
							<div>Be the first to start the discussion!</div>
						</div>
					: null }

				</div>

			</div>
		);
	}
});

export default connect( state => {
	return {
		pubData: state.pub,
		loginData: state.login,
		discussionsData: state.discussions,
		journalData: state.journal,
		slug: state.router.params.slug,
		pathname: state.router.location.pathname,
		query: state.router.location.query,
	};
})( Radium(Discussions) );

styles = {
	container: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0px 10px',
		},
	},
	emptyComments: {
		margin: '40% 6% 0px 3%',
		fontSize: '1.2em',
		textAlign: 'center',
		height: '40vh',
	},
	emptyContainer: {
		margin: '10px auto',
		fontFamily: 'Courier',
		textAlign: 'center',
	},
	sectionWrapper: {
		margin: '10px 0px 30px 0px',
	},
};
