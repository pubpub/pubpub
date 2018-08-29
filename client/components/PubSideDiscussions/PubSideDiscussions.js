import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionThread from 'components/DiscussionThreadNew/DiscussionThread';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';

require('./pubSideDiscussions.scss');

const propTypes = {
	threads: PropTypes.array.isRequired,
	pubData: PropTypes.object.isRequired,
	editorChangeObject: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	onPostDiscussion: PropTypes.func.isRequired,
	onPutDiscussion: PropTypes.func.isRequired,
	getHighlightContent: PropTypes.func.isRequired,
	setActiveThread: PropTypes.func,
	activeThread: PropTypes.string,
	activeDiscussionChannel: PropTypes.object,
	initialContent: PropTypes.object,
	getAbsolutePosition: PropTypes.func.isRequired,
};

const defaultProps = {
	setActiveThread: undefined,
	activeThread: undefined,
	activeDiscussionChannel: { title: 'public' }, //TODO: getActiveDiscussionChannel in Pub.js should really set this
	initialContent: undefined,
};

class PubSideDiscussions extends Component {
	render() {
		// TODO: handling discussion flows
		// Iterate over all discussionSidePreviews
		// Set all to be position: absolute, top: 0
		// On every click - you iterate over them all, calculate their height and set their transformY
		// On every click - you figure out where they want to be, and then get as close as possible given the other
		// heights and position that exist.
		// If one is selected - you have to give that one priority, so you set it first, and then calculate
		// for the previews before and after.

		if (!this.props.editorChangeObject.decorations) { return null; }

		return (
			<div className="pub-side-discussions-component">
				{this.props.activeThread === 'new' &&
					<div
						style={{
							position: 'absolute',
							...this.props.getAbsolutePosition(this.props.editorChangeObject.selectionBoundingBox.top, 0, true),
						}}
					>
						<DiscussionInput
							handleSubmit={this.props.onPostDiscussion}
							// submitIsLoading={this.state.isLoadingReply}
							getHighlightContent={this.props.getHighlightContent}
							inputKey="side-new-thread"
							showTitle={false}
							activeDiscussionChannel={this.props.activeDiscussionChannel}
							initialContent={this.props.initialContent}
						/>
					</div>
				}
				{this.props.threads.filter((thread)=> {
					const threadIsArchived = thread.reduce((prev, curr)=> {
						if (curr.isArchived) { return true; }
						return prev;
					}, false);
					return !threadIsArchived;
				}).filter((thread)=> {
					return thread[0].highlights;
				}).map((thread)=> {
					const highlightId = thread.reduce((prev, curr)=> {
						if (!prev && curr.highlights) { return curr.highlights[0].id; }
						return prev;
					}, undefined);
					const highlightBoundingBox = this.props.editorChangeObject.decorations.reduce((prev, curr)=> {
						if (!curr.attrs) { return prev; }
						if (!prev && curr.attrs.class.indexOf(highlightId) > -1) { return curr.boundingBox; }
						return prev;
					}, undefined);
					if (!highlightBoundingBox) { return null; }
					return (
						<div
							key={`thread-${thread[0].id}`}
							style={{
								position: 'absolute',
								...this.props.getAbsolutePosition(highlightBoundingBox.top, 0, true),
							}}
						>
							<DiscussionThread
								thread={thread}
								isMinimal={true}
								pubData={this.props.pubData}
								locationData={this.props.locationData}
								loginData={this.props.loginData}
								onPostDiscussion={this.props.onPostDiscussion}
								onPutDiscussion={this.props.onPutDiscussion}
								getHighlightContent={this.props.getHighlightContent}
								handleQuotePermalink={this.handleQuotePermalink}
								setActiveThread={this.props.setActiveThread}
								activeThread={this.props.activeThread}
							/>
						</div>
					);
				})}
			</div>
		);
	}
}

PubSideDiscussions.propTypes = propTypes;
PubSideDiscussions.defaultProps = defaultProps;
export default PubSideDiscussions;
