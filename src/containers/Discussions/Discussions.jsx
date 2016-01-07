import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';
import DiscussionsItem from './DiscussionsItem';
import DiscussionsInput from './DiscussionsInput';

import {toggleVisibility} from '../../actions/login';
import {addDiscussion, discussionVoteSubmit, togglePubHighlights} from '../../actions/pub';

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const Discussions = React.createClass({
	propTypes: {
		metaID: PropTypes.string,
		editorCommentMode: PropTypes.bool, 
		inEditor: PropTypes.bool, 

		pubData: PropTypes.object,
		editorData: PropTypes.object,
		loginData: PropTypes.object,
		journalData: PropTypes.object,

		slug: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,

		dispatch: PropTypes.func
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
		discussionObject.pub = this.props.pubData.getIn(['pubData', '_id']);
		discussionObject.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.pubData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.pubData.getIn(['pubData', 'history']).size;
		discussionObject.selections = this.props.pubData.getIn(['newDiscussionData', 'selections']);
		console.log('about to dispatch addDiscussion ', discussionObject, activeSaveID);
		this.props.dispatch(addDiscussion(discussionObject, activeSaveID));
	},

	discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}
		this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
	},

	toggleHighlights: function() {
		this.props.dispatch(togglePubHighlights());
	},

	getPubData: function() {
		if (this.props.inEditor) {
			return this.props.editorData.get('pubEditData') ? this.props.editorData.get('pubEditData').toJS() : {};
		}

		return this.props.pubData.get('pubData') ? this.props.pubData.get('pubData').toJS() : {};
	
	},

	filterDiscussions: function() {
		function findDiscussionRoot(discussions, searchID) {
			for (let index = 0; index < discussions.length; index++) {
				if (discussions[index]._id === searchID) {
					return discussions[index];
				} else if (discussions[index].children && discussions[index].children.length) {
					return findDiscussionRoot(discussions[index].children, searchID);
				}
			}
		}

		const pubData = this.getPubData();
		return [findDiscussionRoot(pubData.discussions, this.props.metaID)];
	},

	render: function() {
		// const pubData = {discussions: []};
		
		const pubData = this.getPubData();
		const discussionsData = this.props.metaID ? this.filterDiscussions() : pubData.discussions;

		return (
			<div style={styles.container}>
				
				<div className="pub-discussions-wrapper" style={rightBarStyles.sectionWrapper}>
					
					{this.props.metaID || (!this.props.editorCommentMode && this.props.inEditor)
						? null
						: <DiscussionsInput 
								addDiscussionHandler={this.addDiscussion}
								addDiscussionStatus={this.props.pubData.get('addDiscussionStatus')} 
								newDiscussionData={this.props.pubData.get('newDiscussionData')} 
								userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])} 
								activeSaveID={this.props.pubData.get('activeSaveID')}
								saveID={'root'}
								isReply={false}
								codeMirrorID={'rootCommentInput'}/>
					}
					
					{
						discussionsData.map((discussion)=>{
							return (<DiscussionsItem 
								key={discussion._id}
								slug={this.props.slug}
								pHashes={pubData.pHashes}
								discussionItem={discussion}

								activeSaveID={this.props.pubData.get('activeSaveID')}
								addDiscussionHandler={this.addDiscussion}
								addDiscussionStatus={this.props.pubData.get('addDiscussionStatus')} 
								newDiscussionData={this.props.pubData.get('newDiscussionData')} 
								userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])} 
								handleVoteSubmit={this.discussionVoteSubmit} 
								noReply={!this.props.editorCommentMode && this.props.inEditor}/>
							);
						})
					}
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
	}
};
