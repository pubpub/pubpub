import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionAuthorsList from 'components/DiscussionAuthorsList/DiscussionAuthorsList';
import DiscussionLabelsList from 'components/DiscussionLabelsList/DiscussionLabelsList';
import DiscussionSortList from 'components/DiscussionSortList/DiscussionSortList';
import { Popover, PopoverInteractionKind, Position, NonIdealState } from '@blueprintjs/core';
import { nestDiscussionsToThreads } from 'utilities';

require('./discussionList.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	onPreviewClick: PropTypes.func,
	mode: PropTypes.string,
	onLabelsSave: PropTypes.func.isRequired,
};

const defaultProps = {
	onPreviewClick: undefined,
	mode: undefined,
};

class DiscussionList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isArchivedMode: false,
			filteredLabels: [],
			filteredAuthors: [],
			sortMode: 'newestThread', // newestThread, oldestThread, newestReply, oldestReply, mostReplies, leastReplies
		};
		this.setDiscussionsMode = this.setDiscussionsMode.bind(this);
		this.setArchivedMode = this.setArchivedMode.bind(this);
		this.toggleFilteredLabel = this.toggleFilteredLabel.bind(this);
		this.toggleFilteredAuthor = this.toggleFilteredAuthor.bind(this);
		this.setSortMode = this.setSortMode.bind(this);
		this.filterAndSortThreads = this.filterAndSortThreads.bind(this);
	}

	setDiscussionsMode() {
		this.setState({ isArchivedMode: false });
	}
	setArchivedMode() {
		this.setState({ isArchivedMode: true });
	}
	setSortMode(sortSlug) {
		this.setState({ sortMode: sortSlug });
	}
	toggleFilteredAuthor(authorId) {
		const newFilteredAuthors = this.state.filteredAuthors.indexOf(authorId) > -1
			? this.state.filteredAuthors.filter((id)=> { return id !== authorId; })
			: [...this.state.filteredAuthors, authorId];
		this.setState({ filteredAuthors: newFilteredAuthors });
	}
	toggleFilteredLabel(labelId) {
		const newFilteredLabels = this.state.filteredLabels.indexOf(labelId) > -1
			? this.state.filteredLabels.filter((id)=> { return id !== labelId; })
			: [...this.state.filteredLabels, labelId];
		this.setState({ filteredLabels: newFilteredLabels });
	}
	filterAndSortThreads(threads, isArchivedList) {
		return threads.filter((items)=> {
			const threadIsArchived = items.reduce((prev, curr)=> {
				if (curr.isArchived) { return true; }
				return prev;
			}, false);
			return isArchivedList ? threadIsArchived : !threadIsArchived;
		}).filter((items)=> {
			const threadLabels = items.reduce((prev, curr)=> {
				if (curr.labels && curr.labels.length) { return curr.labels; }
				return prev;
			}, []);
			if (this.state.filteredLabels.length === 0) { return true; }
			const hasNecessaryLabel = this.state.filteredLabels.reduce((prev, curr)=> {
				if (threadLabels.indexOf(curr) === -1) { return false; }
				return prev;
			}, true);
			return hasNecessaryLabel;
		}).filter((items)=> {
			const authors = {};
			items.forEach((discussion)=> {
				authors[discussion.author.id] = discussion.author;
			});
			if (this.state.filteredAuthors.length === 0) { return true; }
			const hasNecessaryAuthor = this.state.filteredAuthors.reduce((prev, curr)=> {
				if (!authors[curr]) { return false; }
				return prev;
			}, true);
			return hasNecessaryAuthor;
		}).sort((foo, bar)=> {
			/* Newest Thread */
			if (this.state.sortMode === 'newestThread' && foo[0].threadNumber > bar[0].threadNumber) { return -1; }
			if (this.state.sortMode === 'newestThread' && foo[0].threadNumber < bar[0].threadNumber) { return 1; }
			/* Oldest Thread */
			if (this.state.sortMode === 'oldestThread' && foo[0].threadNumber < bar[0].threadNumber) { return -1; }
			if (this.state.sortMode === 'oldestThread' && foo[0].threadNumber > bar[0].threadNumber) { return 1; }
			/* Newest Reply */
			const fooNewestReply = foo.reduce((prev, curr)=> { if (curr.createdAt > prev) { return curr.createdAt; } return prev; }, '0000-02-01T22:21:19.608Z');
			const barNewestReply = bar.reduce((prev, curr)=> { if (curr.createdAt > prev) { return curr.createdAt; } return prev; }, '0000-02-01T22:21:19.608Z');
			if (this.state.sortMode === 'newestReply' && fooNewestReply > barNewestReply) { return -1; }
			if (this.state.sortMode === 'newestReply' && fooNewestReply < barNewestReply) { return 1; }
			/* Oldest Reply */
			const fooOldestReply = foo.reduce((prev, curr)=> { if (curr.createdAt < prev) { return curr.createdAt; } return prev; }, '9999-02-01T22:21:19.608Z');
			const barOldestReply = bar.reduce((prev, curr)=> { if (curr.createdAt < prev) { return curr.createdAt; } return prev; }, '9999-02-01T22:21:19.608Z');
			if (this.state.sortMode === 'oldestReply' && fooOldestReply < barOldestReply) { return -1; }
			if (this.state.sortMode === 'oldestReply' && fooOldestReply > barOldestReply) { return 1; }
			/* Most Replies */
			if (this.state.sortMode === 'mostReplies' && foo.length > bar.length) { return -1; }
			if (this.state.sortMode === 'mostReplies' && foo.length < bar.length) { return 1; }
			/* Least Replies */
			if (this.state.sortMode === 'leastReplies' && foo.length < bar.length) { return -1; }
			if (this.state.sortMode === 'leastReplies' && foo.length > bar.length) { return 1; }
			return 0;
		});
	}

	render() {
		const pubData = this.props.pubData;
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

		const activeThreads = this.filterAndSortThreads(threads, false);
		const archivedThreads = this.filterAndSortThreads(threads, true);
		const filtersActive = this.state.filteredLabels.length || this.state.filteredAuthors.length;
		return (
			<div className="discussion-list-component">
				{!this.props.mode &&
					<button className="pt-button pt-intent-primary new-button" onClick={()=> { this.props.onPreviewClick('new'); }}>
						New Discussion
					</button>
				}
				{!this.props.mode &&
					<h2>Discussions</h2>
				}

				<div className="filter-bar">
					<div className="left">
						<button className={`pt-button pt-minimal ${!this.state.isArchivedMode ? 'active' : ''}`} onClick={this.setDiscussionsMode}>{activeThreads.length} Discussion{activeThreads.length === 1 ? '' : 's'}</button>
						<button className={`pt-button pt-minimal ${this.state.isArchivedMode ? 'active' : ''}`} onClick={this.setArchivedMode}>{archivedThreads.length} Archived</button>
					</div>
					<div className="right">
						<Popover
							content={
								<DiscussionAuthorsList
									threadsData={threads || []}
									selected={this.state.filteredAuthors}
									onSelect={this.toggleFilteredAuthor}
								/>
							}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.BOTTOM_RIGHT}
							popoverClassName="pt-minimal"
							transitionDuration={-1}
							inheritDarkTheme={false}
						>
							<div className={`pt-button pt-minimal ${this.state.filteredAuthors.length ? 'active' : ''}`}>Authors</div>
						</Popover>
						<Popover
							content={
								<DiscussionLabelsList
									labelsData={pubData.labels || []}
									selectedLabels={this.state.filteredLabels}
									permissions={pubData.localPermissions}
									onLabelSelect={this.toggleFilteredLabel}
									onLabelsUpdate={this.props.onLabelsSave}
								/>
							}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.BOTTOM_RIGHT}
							popoverClassName="pt-minimal"
							transitionDuration={-1}
							inheritDarkTheme={false}
						>
							<div className={`pt-button pt-minimal ${this.state.filteredLabels.length ? 'active' : ''}`}>Labels</div>
						</Popover>
						<Popover
							content={
								<DiscussionSortList
									selected={this.state.sortMode}
									onSelect={this.setSortMode}
								/>
							}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.BOTTOM_RIGHT}
							popoverClassName="pt-minimal"
							transitionDuration={-1}
							inheritDarkTheme={false}
						>
							<div className={`pt-button pt-minimal ${this.state.sortMode !== 'newestThread' ? 'active' : ''}`}>Sort</div>
						</Popover>
					</div>
				</div>

				{!this.state.isArchivedMode && !activeThreads.length &&
					<NonIdealState
						title={filtersActive ? 'No Discussions Match Filter' : 'No Discussions Yet'}
						description={filtersActive ? '' : 'Click \'New Discussion\' to start the conversation!'}
						visual="pt-icon-widget"
					/>
				}

				{this.state.isArchivedMode && !archivedThreads.length &&
					<NonIdealState
						title={filtersActive ? 'No Archived Discussions Match Filter' : 'No Archived Discussions'}
						visual="pt-icon-widget"
					/>
				}

				{!this.state.isArchivedMode && activeThreads.map((thread)=> {
					return (
						<DiscussionPreview
							key={`thread-${thread[0].id}`}
							availableLabels={pubData.labels || []}
							slug={pubData.slug}
							discussions={thread}
							onPreviewClick={this.props.onPreviewClick}
						/>
					);
				})}
				{this.state.isArchivedMode && archivedThreads.map((thread)=> {
					return (
						<DiscussionPreview
							key={`thread-${thread[0].id}`}
							availableLabels={pubData.labels || []}
							slug={pubData.slug}
							discussions={thread}
							onPreviewClick={this.props.onPreviewClick}
						/>
					);
				})}
			</div>
		);
	}
}

DiscussionList.propTypes = propTypes;
DiscussionList.defaultProps = defaultProps;
export default DiscussionList;
