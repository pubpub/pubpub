import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Overlay from 'components/Overlay/Overlay';
import DiscussionThread from 'components/DiscussionThread/DiscussionThread';
import { nestDiscussionsToThreads } from 'utilities';

require('./discussionViewer.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	activeThreadNumber: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	getHighlightContent: PropTypes.func.isRequired,
	onPostDiscussion: PropTypes.func.isRequired,
	onPutDiscussion: PropTypes.func.isRequired,
	postDiscussionIsLoading: PropTypes.bool.isRequired,
};

class DiscussionViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPinned: false,
		};
	}

	render() {
		const pubData = this.props.pubData;
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);
		const activeThread = threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === this.props.activeThreadNumber) {
				return curr;
			}
			return prev;
		}, []);

		return (
			<div className="discussion-viewer-component">

				<Overlay isOpen={this.props.activeThreadNumber && this.props.activeThreadNumber !== 'new'} onClose={this.props.onClose} maxWidth={728}>
					<DiscussionThread
						discussions={activeThread}
						canManage={pubData.localPermissions === 'manage' || (this.props.loginData.isAdmin && pubData.adminPermissions === 'manage')}
						slug={pubData.slug}
						loginData={this.props.loginData}
						pathname={`${this.props.locationData.path}${this.props.locationData.queryString}`}
						handleReplySubmit={this.props.onPostDiscussion}
						handleReplyEdit={this.props.onPutDiscussion}
						submitIsLoading={this.props.postDiscussionIsLoading}
						isPresentation={true}
						getHighlightContent={this.props.getHighlightContent}
						hoverBackgroundColor={this.props.communityData.accentMinimalColor}
					/>
				</Overlay>
			</div>
		);
	}
}

DiscussionViewer.propTypes = propTypes;
export default DiscussionViewer;
