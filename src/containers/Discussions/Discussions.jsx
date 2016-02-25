import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';
import DiscussionsItem from './DiscussionsItem';
import DiscussionsInput from './DiscussionsInput';

import {toggleVisibility} from '../../actions/login';
import {addDiscussion, discussionVoteSubmit, togglePubHighlights, archiveDiscussion} from '../../actions/pub';
import {discussionVoteSubmit as discussionVoteSubmitEditor, archiveComment} from '../../actions/editor';
import {addComment} from '../../actions/editor';

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const Discussions = React.createClass({
	propTypes: {
		metaID: PropTypes.string,
		editorCommentMode: PropTypes.bool,
		inEditor: PropTypes.bool,
		instanceName: PropTypes.string,

		pubData: PropTypes.object,
		editorData: PropTypes.object,
		loginData: PropTypes.object,
		journalData: PropTypes.object,

		slug: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,

		dispatch: PropTypes.func,

	},

	getDefaultProps: function() {
		return {
			editorCommentMode: false,
			inEditor: false,
		};
	},

	addDiscussion: function(discussionObject, activeSaveID) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		// console.log(discussionObject);
		if (!discussionObject.markdown) {
			return null;
		}

		if (this.props.inEditor) {
			discussionObject.pub = this.props.editorData.getIn(['pubEditData', '_id']);
			discussionObject.version = 0;
			discussionObject.selections = this.props.editorData.getIn(['newDiscussionData', 'selections']);
		} else {
			discussionObject.pub = this.props.pubData.getIn(['pubData', '_id']);
			discussionObject.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.pubData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.pubData.getIn(['pubData', 'history']).size;
			discussionObject.selections = this.props.pubData.getIn(['newDiscussionData', 'selections']);
		}

		// Check if it's a comment or discussion we're adding.
		if (this.props.editorCommentMode) {
			this.props.dispatch(addComment(discussionObject, activeSaveID));
		} else {
			this.props.dispatch(addDiscussion(discussionObject, activeSaveID, this.props.inEditor));
		}

	},

	discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		if (this.props.editorCommentMode) {
			this.props.dispatch(discussionVoteSubmitEditor(type, discussionID, userYay, userNay));
		} else {
			this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
		}
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

	getDiscussionData: function() {
		// Point to the right state source
		let pubData = {};
		if (this.props.inEditor) {
			pubData = this.props.editorData.get('pubEditData') && this.props.editorData.get('pubEditData').toJS ? this.props.editorData.get('pubEditData').toJS() : {};
		} else {
			pubData = this.props.pubData.get('pubData') && this.props.pubData.get('pubData').toJS ? this.props.pubData.get('pubData').toJS() : {};
		}
		// Point to the right list of discssion items
		let discussionsData = [];
		if (this.props.editorCommentMode) {
			discussionsData = pubData.editorComments;
		} else {
			discussionsData = pubData.discussions;
		}
		// Filter the items if we have a metaID
		discussionsData = this.props.metaID ? this.filterDiscussions(discussionsData) : discussionsData;
		// Check to make sure it's not undefined
		discussionsData = discussionsData ? discussionsData : [];
		return discussionsData;
	},

	archiveDiscussion: function(objectID) {
		if (this.props.editorCommentMode) {
			this.props.dispatch(archiveComment(objectID));
		} else {
			this.props.dispatch(archiveDiscussion(objectID));
		}
	},

	render: function() {
		// const pubData = {discussions: []};

		const discussionsData = this.getDiscussionData();

		const addDiscussionStatus = this.props.inEditor ? this.props.editorData.get('addDiscussionStatus') : this.props.pubData.get('addDiscussionStatus');
		const newDiscussionData = this.props.inEditor ? this.props.editorData.get('newDiscussionData') : this.props.pubData.get('newDiscussionData');
		const activeSaveID = this.props.inEditor ? this.props.editorData.get('activeSaveID') : this.props.pubData.get('activeSaveID');
		const isPubAuthor = this.props.inEditor ? !this.props.editorData.getIn(['pubEditData', 'isReader']) : this.props.pubData.getIn(['pubData', 'isAuthor']);

		return (
			<div style={styles.container}>

				<div className="pub-discussions-wrapper" style={rightBarStyles.sectionWrapper}>
					{this.props.pubData.getIn(['pubData', 'referrer', 'name'])
						? <div>{this.props.pubData.getIn(['pubData', 'referrer', 'name'])} invites you to comment!</div>
						: null
					}

					{this.props.metaID || (!this.props.editorCommentMode && this.props.inEditor)
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
							return (<DiscussionsItem
								key={discussion._id}
								slug={this.props.slug}
								discussionItem={discussion}
								instanceName={this.props.instanceName}
								isPubAuthor={isPubAuthor}

								activeSaveID={activeSaveID}
								addDiscussionHandler={this.addDiscussion}
								addDiscussionStatus={addDiscussionStatus}
								newDiscussionData={newDiscussionData}
								userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
								handleVoteSubmit={this.discussionVoteSubmit}
								handleArchive={this.archiveDiscussion}
								noReply={!this.props.editorCommentMode && this.props.inEditor}
								noPermalink={this.props.editorCommentMode}/>
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
		editorData: state.editor,
		loginData: state.login,
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
		height: '70vh',
	},
};
