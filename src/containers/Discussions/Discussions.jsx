import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
// import {globalStyles} from 'utils/styleConstants';
// import {rightBarStyles} from 'containers/PubReader/rightBarStyles';
import DiscussionsItem from './DiscussionsItem';
import DiscussionsInput from './DiscussionsInput';

import {toggleVisibility} from 'actions/login';
import {addDiscussion, discussionVoteSubmit, archiveDiscussion} from 'actions/discussions';

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

		discussionsData: PropTypes.object,
		pubData: PropTypes.object,
		// editorData: PropTypes.object,
		loginData: PropTypes.object,
		journalData: PropTypes.object,

		slug: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,

		dispatch: PropTypes.func,

	},

	addDiscussion: function(discussionObject, activeSaveID) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		if (!discussionObject.markdown) { return null; }

		const pathname = this.props.pathname;
		if (pathname.substring(pathname.length - 6, pathname.length) === '/draft') {
			// We are commenting from the draft, so mark it so.
			discussionObject.version = 0;
		} else {
			discussionObject.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.pubData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.pubData.getIn(['pubData', 'history']).size;
		}
		discussionObject.pub = this.props.pubData.getIn(['pubData', '_id']);
		discussionObject.sourceJournal = this.props.journalData.getIn(['journalData', '_id']);
		this.props.dispatch(addDiscussion(discussionObject, activeSaveID));
	},

	discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}
		this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
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

		const output = [findDiscussionRoot(discussionsData, this.props.metaID)];
		return output;
	},

	archiveDiscussion: function(objectID) {
		this.props.dispatch(archiveDiscussion(objectID));
	},

	getHotness: function(discussion) {
		const yays = (discussion.yays) ? discussion.yays : 0;
		const nays = (discussion.nays) ? discussion.nays : 0;
		const timestamp = (discussion.postDate) ? new Date(discussion.postDate) : new Date(0);
		return hotScore(yays, nays, timestamp);
	},

	render: function() {

		let discussionsData = this.props.discussionsData.get('discussions') && this.props.discussionsData.get('discussions').toJS ? this.props.discussionsData.get('discussions').toJS() : [];
		discussionsData = this.props.metaID ? this.filterDiscussions(discussionsData) : discussionsData;

		const addDiscussionStatus = this.props.discussionsData.get('addDiscussionStatus');
		// const newDiscussionData = this.props.discussionsData.get('newDiscussionData');
		const activeSaveID = this.props.discussionsData.get('activeSaveID');
		const isPubAuthor = this.props.pubData.getIn(['pubData', 'isAuthor']);
		const isPublished = this.props.pubData.getIn(['pubData', 'isPublished']);

		discussionsData.sort(function(aIndex, bIndex) { return this.getHotness(bIndex) - this.getHotness(aIndex); }.bind(this));
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
							userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
							activeSaveID={activeSaveID}
							saveID={'root'}
							isCollaborator={this.props.pubData.getIn(['pubData', 'isCollaborator'])}
							parentIsPrivate={false}
							isReply={false}
							codeMirrorID={'rootCommentInput'}
							isPublished={isPublished} />
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

									isCollaborator={this.props.pubData.getIn(['pubData', 'isCollaborator'])}
									activeSaveID={activeSaveID}
									addDiscussionHandler={this.addDiscussion}
									addDiscussionStatus={addDiscussionStatus}
									userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
									handleVoteSubmit={this.discussionVoteSubmit}
									handleArchive={this.archiveDiscussion}
									isPublished={isPublished} />

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
