import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Button, NonIdealState } from '@blueprintjs/core';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';
import DiscussionLabels from 'components/DiscussionLabels/DiscussionLabels';
import DiscussionThreadItem from 'components/DiscussionThreadItem/DiscussionThreadItem';

require('./discussionThread.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	discussions: PropTypes.array.isRequired,
	canManage: PropTypes.bool,
	slug: PropTypes.string.isRequired,
	loginData: PropTypes.object,
	pathname: PropTypes.string.isRequired,
	handleReplySubmit: PropTypes.func.isRequired,
	handleReplyEdit: PropTypes.func.isRequired,
	submitIsLoading: PropTypes.bool,
	hideScrollButton: PropTypes.bool,
	onPublish: PropTypes.func,
	publishIsLoading: PropTypes.bool,
	getHighlightContent: PropTypes.func,
	handleQuotePermalink: PropTypes.func,
	hoverBackgroundColor: PropTypes.string,
	setThread: PropTypes.func.isRequired,
};
const defaultProps = {
	canManage: false,
	loginData: {},
	submitIsLoading: false,
	hideScrollButton: false,
	onPublish: ()=>{},
	publishIsLoading: false,
	getHighlightContent: undefined,
	handleQuotePermalink: undefined,
	hoverBackgroundColor: undefined,
};

class DiscussionThread extends Component {
	constructor(props) {
		super(props);

		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		this.state = {
			isEditing: false,
			submitDisabled: false,
			title: sortedDiscussions[0] ? sortedDiscussions[0].title : '',
			isLoading: false,
			archiveIsLoading: false,
		};

		this.editorRef = undefined;
		this.onEditToggle = this.onEditToggle.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handlePublish = this.handlePublish.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.saveLabels = this.saveLabels.bind(this);
		this.archiveDiscussion = this.archiveDiscussion.bind(this);
		this.onReplySubmit = this.onReplySubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const oldSortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});
		const newSortedDiscussions = nextProps.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		const oldEditedAt = oldSortedDiscussions[0].updatedAt;
		const newEditedAt = newSortedDiscussions[0].updatedAt;
		if (oldEditedAt !== newEditedAt) {
			this.setState({
				isEditing: false,
				title: newSortedDiscussions[0].title,
				isLoading: false,
				archiveIsLoading: false,
			});
		}
	}

	onEditToggle() {
		this.setState({ isEditing: !this.state.isEditing });
	}

	onSubmit(evt) {
		evt.preventDefault();
		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		this.setState({ isLoading: true });
		this.props.handleReplyEdit({
			title: this.state.title,
			labels: this.state.labels,
			pubId: sortedDiscussions[0].pubId,
			discussionId: sortedDiscussions[0].id,
			userId: sortedDiscussions[0].userId,
		});
	}

	archiveDiscussion() {
		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});
		this.setState({ archiveIsLoading: true });
		this.props.handleReplyEdit({
			isArchived: !sortedDiscussions[0].isArchived,
			pubId: sortedDiscussions[0].pubId,
			discussionId: sortedDiscussions[0].id,
			userId: sortedDiscussions[0].userId,
		});
	}

	handleTitleChange(evt) {
		this.setState({
			title: evt.target.value,
			submitDisabled: !evt.target.value,
		});
	}
	saveLabels(newLabels) {
		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		this.props.handleReplyEdit({
			labels: newLabels,
			pubId: sortedDiscussions[0].pubId,
			discussionId: sortedDiscussions[0].id,
			userId: sortedDiscussions[0].userId,
		});
	}

	onReplySubmit(replyObject) {
		this.props.handleReplySubmit({
			userId: this.props.loginData.id,
			threadNumber: this.props.discussions[0].threadNumber,
			isPublic: this.props.discussions[0].isPublic,
			pubId: this.props.discussions[0].pubId,
			content: replyObject.content,
			text: replyObject.text,
			highlights: replyObject.highlights,
		});
	}
	handlePublish() {
		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});
		const submitHash = sortedDiscussions[0].submitHash;
		this.props.onPublish(submitHash);
	}
	render() {
		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		if (!sortedDiscussions.length) {
			return (
				<NonIdealState
					title="Discussion Thread Not Found"
					visual="pt-icon-widget"
				/>
			);
		}

		const canManageThread =
			sortedDiscussions[0].userId === this.props.loginData.id || // User is author of thread
			this.props.canManage; // User has pub-level admin permissions (individual or community)

		const isArchived = sortedDiscussions[0].isArchived;
		const isPublic = sortedDiscussions[0].isPublic;

		return (
			<div className="discussion-thread-component">
				{/*!this.props.isPresentation &&
					<a
						// href={`/pub/${this.props.slug}/collaborate`}
						onClick={()=> { this.props.setThread(undefined); }}
						className="top-button pt-button pt-minimal"
					>
						Show all threads
					</a>
				*/}

				{isArchived &&
					<div className={`pt-callout ${sortedDiscussions[0].submitApprovedAt ? 'pt-intent-success' : 'pt-intent-danger'}`}>
						{!sortedDiscussions[0].submitHash && 'Thread is Archived'}
						{sortedDiscussions[0].submitHash && !sortedDiscussions[0].submitApprovedAt && 'Submission Cancelled'}
						{sortedDiscussions[0].submitHash && sortedDiscussions[0].submitApprovedAt &&
							<div>
								<div>Submission Approved and Published</div>
								<TimeAgo date={sortedDiscussions[0].submitApprovedAt} />
							</div>
						}
						{canManageThread && !sortedDiscussions[0].submitHash &&
							<Button
								type="button"
								text="Unarchive"
								className="pt-small"
								loading={this.state.archiveIsLoading}
								onClick={this.archiveDiscussion}
							/>
						}
					</div>
				}

				{!isPublic &&
					<div className="pt-callout">
						<h5>Thread is Private</h5>
						<div>Visible to those with view, edit, or manage permissions.</div>
					</div>
				}

				{!sortedDiscussions[0].submitHash && canManageThread && !this.state.isEditing && !isArchived &&
					<div className="thread-buttons pt-button-group pt-small">
						<button type="button" className="pt-button" onClick={this.onEditToggle}>
							Edit
						</button>
						<Button
							type="button"
							text="Archive"
							loading={this.state.archiveIsLoading}
							onClick={this.archiveDiscussion}
						/>
					</div>
				}

				{this.state.isEditing &&
					<div>
						<input
							value={this.state.title}
							onChange={this.handleTitleChange}
							className="pt-input pt-fill"
							type="text"
						/>
						<div className="editing-buttons">
							<Button
								text="Cancel Edit"
								className="pt-small"
								onClick={this.onEditToggle}
							/>
							<Button
								name="submit"
								type="submit"
								text="Edit Title"
								className="pt-small pt-intent-primary"
								onClick={this.onSubmit}
								disabled={this.state.submitDisabled}
								loading={this.state.isLoading}
							/>
						</div>
					</div>
				}

				{!this.state.isEditing &&
					<div className="title">{sortedDiscussions[0].title}</div>
				}

				<DiscussionLabels
					availableLabels={this.props.pubData.labels || []}
					labelsData={sortedDiscussions[0].labels || []}
					onLabelsSave={this.saveLabels}
					isAdmin={this.props.canManage}
					canManageThread={canManageThread}
				/>

				{sortedDiscussions[0].submitHash && !isArchived &&
					<div className="submission-buttons">
						{this.props.loginData.isAdmin &&
							<Button
								type="button"
								className="pt-intent-primary pt-small"
								text="Accept and Publish"
								loading={this.props.publishIsLoading}
								onClick={this.handlePublish}
							/>
						}
						{(this.props.loginData.isAdmin || this.props.canManage) &&
							<Button
								type="button"
								className="pt-small"
								text="Cancel Submission"
								loading={this.state.archiveIsLoading}
								onClick={this.archiveDiscussion}
							/>
						}
					</div>
				}

				<div>
					{sortedDiscussions.map((discussion)=> {
						return (
							<DiscussionThreadItem
								key={`discussion-${discussion.id}`}
								discussion={discussion}
								isAuthor={isArchived ? false : discussion.userId === this.props.loginData.id || this.props.loginData.id === 'b242f616-7aaa-479c-8ee5-3933dcf70859'}
								onReplyEdit={this.props.handleReplyEdit}
								hideScrollButton={this.props.hideScrollButton}
								getHighlightContent={this.props.getHighlightContent}
								handleQuotePermalink={this.props.handleQuotePermalink}
								hoverBackgroundColor={this.props.hoverBackgroundColor}
							/>
						);
					})}
				</div>

				{!isArchived &&
					<div>
						{this.props.loginData.id
							? <DiscussionInput
								handleSubmit={this.onReplySubmit}
								submitIsLoading={this.props.submitIsLoading}
								getHighlightContent={this.props.getHighlightContent}
							/>
							: <a href={`/login?redirect=${this.props.pathname}`} className="pt-button pt-fill">
								Login to Reply
							</a>
						}
					</div>
				}
			</div>
		);
	}
}

DiscussionThread.propTypes = propTypes;
DiscussionThread.defaultProps = defaultProps;
export default DiscussionThread;
