import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionLabelsList from 'components/DiscussionLabelsList/DiscussionLabelsList';
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
			// isArchivedVisible: false,
			filteredLabels: [],
		};
		this.setDiscussionsMode = this.setDiscussionsMode.bind(this);
		this.setArchivedMode = this.setArchivedMode.bind(this);
		this.toggleFilteredLabel = this.toggleFilteredLabel.bind(this);
	}

	setDiscussionsMode() {
		this.setState({ isArchivedMode: false });
	}
	setArchivedMode() {
		this.setState({ isArchivedMode: true });
	}
	// toggleArchivedVisible() {
	// 	this.setState({ isArchivedVisible: !this.state.isArchivedVisible });
	// }
	toggleFilteredLabel(labelId) {
		const newFilteredLabels = this.state.filteredLabels.indexOf(labelId) > -1
			? this.state.filteredLabels.filter((id)=> { return id !== labelId; })
			: [...this.state.filteredLabels, labelId];
		this.setState({ filteredLabels: newFilteredLabels });
	}

	render() {
		const pubData = this.props.pubData;
		const discussions = pubData.discussions || [];
		const threads = nestDiscussionsToThreads(discussions);

		const activeThreads = threads.filter((items)=> {
			const threadLabels = items[0].labels || [];
			if (this.state.filteredLabels.length === 0) { return true; }
			const hasNecessaryLabel = this.state.filteredLabels.reduce((prev, curr)=> {
				if (threadLabels.indexOf(curr) === -1) { return false; }
				return prev;
			}, true);
			return hasNecessaryLabel;
		}).filter((items)=> {
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
		const filtersActive = this.state.filteredLabels.length;
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
						<div className="pt-button pt-minimal">Authors</div>
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
							<div className="pt-button pt-minimal">Labels</div>
						</Popover>
						<div className="pt-button pt-minimal">Sort</div>
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
