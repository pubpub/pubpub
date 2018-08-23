import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionThread from 'components/DiscussionThreadNew/DiscussionThread';

require('./pubSideDiscussions.scss');

const propTypes = {
	threads: PropTypes.array.isRequired,
	pubData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	onPostDiscussion: PropTypes.func.isRequired,
	onPutDiscussion: PropTypes.func.isRequired,
	getHighlightContent: PropTypes.func.isRequired,
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
		return (
			<div className="pub-side-discussions-component">
				{this.props.threads.filter((thread)=> {
					const threadIsArchived = thread.reduce((prev, curr)=> {
						if (curr.isArchived) { return true; }
						return prev;
					}, false);
					return !threadIsArchived;
				}).map((thread)=> {
					return (
						<DiscussionThread
							key={`thread-${thread[0].id}`}
							thread={thread}
							isMinimal={true}
							pubData={this.props.pubData}
							locationData={this.props.locationData}
							loginData={this.props.loginData}
							onPostDiscussion={this.props.onPostDiscussion}
							onPutDiscussion={this.props.onPutDiscussion}
							getHighlightContent={this.props.getHighlightContent}
							handleQuotePermalink={this.handleQuotePermalink}
						/>
					);
				})}
			</div>
		);
	}
}

PubSideDiscussions.propTypes = propTypes;
export default PubSideDiscussions;
