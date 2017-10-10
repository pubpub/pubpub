import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import DiscussionInput from 'components/DiscussionInput/DiscussionInput';
import DiscussionThreadItem from 'components/DiscussionThreadItem/DiscussionThreadItem';

require('./discussionThread.scss');

const propTypes = {
	discussions: PropTypes.array.isRequired,
	canManage: PropTypes.bool,
	slug: PropTypes.string.isRequired,
	loginData: PropTypes.object,
	pathname: PropTypes.string.isRequired,
	handleReplySubmit: PropTypes.func.isRequired,
	handleReplyEdit: PropTypes.func.isRequired,
	submitLoading: PropTypes.bool,
};
const defaultProps = {
	canManage: false,
	loginData: {},
	submitLoading: false,
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
			title: sortedDiscussions[0].title,
			isLoading: false,
			archiveIsLoading: false,
		};

		this.editorRef = undefined;
		this.onEditToggle = this.onEditToggle.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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

	onReplySubmit(replyObject) {
		this.props.handleReplySubmit({
			userId: this.props.loginData.id,
			threadNumber: this.props.discussions[0].threadNumber,
			pubId: this.props.discussions[0].pubId,
			content: replyObject.content,
			text: replyObject.text
		});
	}

	render() {
		const sortedDiscussions = this.props.discussions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return 1; }
			if (foo.createdAt < bar.createdAt) { return -1; }
			return 0;
		});

		const canManageThread =
			sortedDiscussions[0].userId === this.props.loginData.id || // User is author of thread
			this.props.canManage; // User has pub-level admin permissions (individual or community)

		const isArchived = sortedDiscussions[0].isArchived;

		return (
			<div className={'discussion-thread'}>
				<Link to={`/pub/${this.props.slug}/collaborate`} className={'top-button pt-button pt-minimal'}>
					Show all threads
				</Link>

				{isArchived &&
					<div className={'pt-callout pt-intent-danger'}>
						Thread is Archived
						{canManageThread &&
							<Button
								type={'button'}
								text={'Unarchive'}
								className={'pt-small'}
								loading={this.state.archiveIsLoading}
								onClick={this.archiveDiscussion}
							/>
						}
					</div>
				}

				{canManageThread && !this.state.isEditing && !isArchived &&
					<div className={'thread-buttons pt-button-group pt-minimal pt-small'}>
						<button type={'button'} className={'pt-button pt-icon-edit2'} onClick={this.onEditToggle} />
						<Button
							type={'button'}
							iconName={'compressed'}
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
							className={'pt-input pt-fill'}
							type={'text'}
						/>
						<div className={'editing-buttons'}>
							<Button
								text={'Cancel Edit'}
								className={'pt-small'}
								onClick={this.onEditToggle}
							/>
							<Button
								name={'submit'}
								type={'submit'}
								text={'Edit Title'}
								className={'pt-small pt-intent-primary'}
								onClick={this.onSubmit}
								disabled={this.state.submitDisabled}
								loading={this.state.isLoading}
							/>
						</div>
					</div>
				}

				{!this.state.isEditing &&
					<div className={'title'}>{sortedDiscussions[0].title}</div>
				}

				<div>
					{sortedDiscussions.map((discussion)=> {
						return (
							<DiscussionThreadItem
								key={`discussion-${discussion.id}`}
								discussion={discussion}
								isAuthor={isArchived ? false : discussion.userId === this.props.loginData.id}
								onReplyEdit={this.props.handleReplyEdit}
							/>
						);
					})}
				</div>

				{!isArchived &&
					<div>
						{this.props.loginData.id
							? <DiscussionInput handleSubmit={this.onReplySubmit} submitLoading={this.props.submitLoading} />
							: <Link to={`/login?redirect=${this.props.pathname}`} className={'pt-button pt-fill'}>
								Login to Reply
							</Link>
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
