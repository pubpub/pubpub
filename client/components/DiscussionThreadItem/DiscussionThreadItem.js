import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Button } from '@blueprintjs/core';
import Avatar from 'components/Avatar/Avatar';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import { Editor } from '@pubpub/editor';
import HighlightQuote from '@pubpub/editor/addons/HighlightQuote';

require('./discussionThreadItem.scss');

const propTypes = {
	discussion: PropTypes.object.isRequired,
	isAuthor: PropTypes.bool,
	hideScrollButton: PropTypes.bool,
	onReplyEdit: PropTypes.func,
	getHighlightContent: PropTypes.func,
	handleQuotePermalink: PropTypes.func,
	hoverBackgroundColor: PropTypes.string,
};
const defaultProps = {
	isAuthor: false,
	hideScrollButton: false,
	onReplyEdit: ()=> {},
	getHighlightContent: undefined,
	handleQuotePermalink: undefined,
	hoverBackgroundColor: undefined,
};

class DiscussionThreadItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEditing: false,
			submitDisabled: false,
			body: props.discussion.content,
			isLoading: false,
		};
		this.editorRef = undefined;
		this.onEditToggle = this.onEditToggle.bind(this);
		this.onBodyChange = this.onBodyChange.bind(this);
		this.focusEditor = this.focusEditor.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const oldEditedAt = this.props.discussion.updatedAt;
		const newEditedAt = nextProps.discussion.updatedAt;
		if (oldEditedAt !== newEditedAt) {
			this.setState({
				isEditing: false,
				body: nextProps.discussion.content,
				isLoading: false,
			});
		}
	}

	onEditToggle() {
		this.setState({ isEditing: !this.state.isEditing });
	}

	onBodyChange(val) {
		this.setState({
			body: val,
			submitDisabled: !this.editorRef.view.state.doc.textContent,
		});
	}

	focusEditor() {
		this.editorRef.focus();
	}

	onSubmit(evt) {
		evt.preventDefault();
		this.setState({ isLoading: true });
		const highlights = this.editorRef.view.state.doc.content.content.filter((item)=> {
			return item.type.name === 'highlightQuote';
		}).map((item)=> {
			return item.attrs;
		});
		this.props.onReplyEdit({
			content: this.state.body,
			text: this.editorRef.view.state.doc.textContent,
			pubId: this.props.discussion.pubId,
			discussionId: this.props.discussion.id,
			userId: this.props.discussion.userId,
			highlights: highlights.length ? highlights : undefined,
		});
	}

	render() {
		const discussion = this.props.discussion;
		const editingProps = this.state.isEditing
			? {
				onClick: this.focusEditor,
				tabIndex: -1,
				role: 'textbox',
				className: 'text editing',
			}
			: {};

		return (
			<div className="discussion-thread-item-component">
				<div className="item-header">
					<a href={`/user/${discussion.author.slug}`}>
						<Avatar
							width={30}
							userInitials={discussion.author.initials}
							userAvatar={discussion.author.avatar}
						/>
					</a>

					<div className="details">
						<div className="name">
							<a href={`/user/${discussion.author.slug}`}>{discussion.author.fullName || discussion.author.userInitials}</a>
						</div>
						<span className="date">
							<TimeAgo date={discussion.createdAt} />
							{discussion.createdAt !== discussion.updatedAt &&
								<span> (edited)</span>
							}
						</span>
					</div>

					{!this.state.isEditing &&
						<div className="pt-button-group pt-small">
							{this.props.isAuthor &&
								<button type="button" className="pt-button" onClick={this.onEditToggle}>
									Edit
								</button>
							}

							{/*
							<DropdownButton icon="pt-icon-more" isRightAligned={true}>
								<div className="pt-menu">
									<div className="pt-menu-item pt-popover-dismiss">
										Flag
									</div>
									<div className="pt-menu-item pt-popover-dismiss">
										Link To...
									</div>
								</div>
							</DropdownButton>
							*/}
						</div>
					}

				</div>

				<div className="text" {...editingProps} key="editor-wrapper">
					<Editor
						key={this.state.isEditing ? `discussion-${discussion.id}-editing` : `discussion-${discussion.id}`}
						ref={(ref)=> { this.editorRef = ref; }}
						initialContent={discussion.content}
						isReadOnly={!this.state.isEditing}
						placeholder="Reply..."
						onChange={this.onBodyChange}
					>
						{this.state.isEditing &&
							<FormattingMenu include={['link']} />
						}
						<HighlightQuote
							hideScrollButton={this.props.hideScrollButton}
							getHighlightContent={this.props.getHighlightContent}
							handlePermalink={this.props.handleQuotePermalink}
							hoverBackgroundColor={this.props.hoverBackgroundColor}
						/>
					</Editor>
				</div>
				{this.state.isEditing &&
					<div className="editing-buttons">
						<Button
							text="Cancel Edit"
							className="pt-small"
							onClick={this.onEditToggle}
						/>
						<Button
							name="submit"
							type="submit"
							text="Edit Reply"
							className="pt-small pt-intent-primary"
							onClick={this.onSubmit}
							disabled={this.state.submitDisabled}
							loading={this.state.isLoading}
						/>
					</div>
				}

			</div>
		);
	}
}

DiscussionThreadItem.propTypes = propTypes;
DiscussionThreadItem.defaultProps = defaultProps;
export default DiscussionThreadItem;
