import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionPreviewArchived from 'components/DiscussionPreviewArchived/DiscussionPreviewArchived';
import { nestDiscussionsToThreads } from 'utilities';

require('./discussionList.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	onPreviewClick: PropTypes.func.isRequired,
};

class DiscussionList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isArchivedVisible: false,
		};
		this.toggleArchivedVisible = this.toggleArchivedVisible.bind(this);
	}

	toggleArchivedVisible() {
		this.setState({ isArchivedVisible: !this.state.isArchivedVisible });
	}

	render() {
		const pubData = this.props.pubData;
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

		const activeThreads = threads.filter((items)=> {
			return items.reduce((prev, curr)=> {
				if (curr.isArchived) { return false; }
				return prev;
			}, true);
		}).sort((foo, bar)=> {
			if (foo[0].threadNumber > bar[0].threadNumber) { return -1; }
			if (foo[0].threadNumber < bar[0].threadNumber) { return 1; }
			return 0;
		});

		const archivedThreads = threads.filter((items)=> {
			return items.reduce((prev, curr)=> {
				if (curr.isArchived) { return true; }
				return prev;
			}, false);
		}).sort((foo, bar)=> {
			if (foo[0].threadNumber > bar[0].threadNumber) { return -1; }
			if (foo[0].threadNumber < bar[0].threadNumber) { return 1; }
			return 0;
		});

		return (
			<div className="discussion-list-component">
				<h2>Discussions</h2>
				<button className="pt-button pt-intent-primary" onClick={()=> { this.props.onPreviewClick('new'); }}>
					New Discussion
				</button>
				{activeThreads.map((thread)=> {
					return (
						<DiscussionPreview
							key={`thread-${thread[0].id}`}
							discussions={thread}
							onPreviewClick={this.props.onPreviewClick}
						/>
					);
				})}
				{!!archivedThreads.length &&
					<div className="archived-threads">
						<button className="pt-button pt-minimal pt-large pt-fill archive-title-button" onClick={this.toggleArchivedVisible}>
							{this.state.isArchivedVisible ? 'Hide ' : 'Show '}
							Archived Thread{archivedThreads.length === 1 ? '' : 's'} ({archivedThreads.length})
						</button>
						{this.state.isArchivedVisible && archivedThreads.map((thread)=> {
							return (
								<DiscussionPreviewArchived
									key={`thread-${thread[0].id}`}
									discussions={thread}
									onPreviewClick={this.props.onPreviewClick}
								/>
							);
						})}
					</div>
				}
			</div>
		);
	}
}

DiscussionList.propTypes = propTypes;
export default DiscussionList;
