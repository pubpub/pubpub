import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import {globalStyles} from 'utils/styleConstants';
// import {rightBarStyles} from 'containers/PubReader/rightBarStyles';
import DiscussionsItem from './DiscussionsItem';
import DiscussionsInput from './DiscussionsInput';

// import Portal from 'react-portal';
import {AssetLibrary} from 'containers';

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
	getInitialState() {
		return {
			showAssetLibrary: false,
			assetLibraryCodeMirrorID: undefined,
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.loginData.get('addedHighlight') === undefined && nextProps.loginData.get('addedHighlight')) {
			const assetObject = nextProps.loginData.get('addedHighlight').toJS();

			const cmInstances = document.getElementsByClassName('CodeMirror');
			for (const instance of cmInstances) {
				const cm = instance.CodeMirror;
				const currentSelection = cm.getCursor();
				const inlineObject = {pluginType: 'highlight', source: {...assetObject.assetData, ...{_id: assetObject._id} }};
				cm.replaceRange('[[' + JSON.stringify(inlineObject) + ']]', {line: currentSelection.line, ch: currentSelection.ch});
			}
		}
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

	toggleAssetLibrary: function(codeMirrorID) {
		return ()=>{
			if (!this.props.loginData.get('loggedIn')) {
				return this.props.dispatch(toggleVisibility());
			}
			console.log(codeMirrorID);
			this.setState({
				showAssetLibrary: !this.state.showAssetLibrary,
				assetLibraryCodeMirrorID: codeMirrorID
			});
		};

	},
	closeAssetLibrary: function() {
		this.setState({
			showAssetLibrary: false,
			assetLibraryCodeMirrorID: undefined,
		});
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

				<div>
					<div className="modal-splash" onClick={this.closeAssetLibrary} style={[styles.modalSplash, this.state.showAssetLibrary && styles.modalSplashActive]}></div>
					<div style={[styles.assetLibraryWrapper, this.state.showAssetLibrary && styles.assetLibraryWrapperActive]}>
						{this.state.showAssetLibrary
							? <AssetLibrary
								closeLibrary={this.closeAssetLibrary}
								codeMirrorInstance={document.getElementById(this.state.assetLibraryCodeMirrorID).childNodes[0].CodeMirror} />
							: null
						}
					</div>
				</div>

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
							isPublished={isPublished}
							toggleAssetLibrary={this.toggleAssetLibrary}/>
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
									isPublished={isPublished}
									toggleAssetLibrary={this.toggleAssetLibrary}/>

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
	modalSplash: {
		opacity: 0,
		pointerEvents: 'none',
		width: '100vw',
		height: '100vh',
		position: 'fixed',
		top: 0,
		left: 0,
		backgroundColor: 'rgba(255,255,255,0.7)',
		transition: '.1s linear opacity',
		zIndex: 100,
	},
	modalSplashActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	assetLibraryWrapper: {
		...globalStyles.largeModal,
		zIndex: 150,
		fontFamily: 'Lato',

		opacity: 0,
		pointerEvents: 'none',
		transform: 'scale(0.9)',
		transition: '.1s linear opacity, .1s linear transform',
	},
	assetLibraryWrapperActive: {
		opacity: 1,
		pointerEvents: 'auto',
		transform: 'scale(1.0)',
	},
};
