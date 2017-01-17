import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { Loader } from 'components';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';
import ReactMarkdown from 'react-markdown';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider, Tooltip } from '@blueprintjs/core';
import { postDiscussion, putDiscussion, postReaction, deleteReaction } from './actionsDiscussions';
import PubLabelList from './PubLabelList';

let styles;

export const PubDiscussion = React.createClass({
	propTypes: {
		discussion: PropTypes.object,
		pub: PropTypes.object,
		allReactions: PropTypes.array,
		accountId: PropTypes.number,
		pathname: PropTypes.string,
		query: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			description: '',
			openEditor: undefined,
			editTitle: undefined,
			editDescription: undefined,
		};
	},

	componentWillMount() {
		this.setState({ editTitle: this.props.discussion.title });
	},
	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({ description: '', openEditor: undefined });
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	validate: function(data) {
		// Check to make sure name exists
		if (!data.description || !data.description.length) {
			return { isValid: false, validationError: <FormattedMessage id="discussion.CannotPostEmptyReply" defaultMessage="Cannot post empty reply" /> };
		}

		return { isValid: true, validationError: undefined };

	},

	createSubmit: function(evt) {
		evt.preventDefault();
		if (!this.props.accountId) {
			return this.setState({ validationError: 'Must be Logged In' });
		}
		const createData = {
			replyRootPubId: this.props.pub.id,
			replyParentPubId: this.props.discussion.id,
			title: 'Reply to: ' + this.props.discussion.title,
			description: this.state.description,
		};
		const { isValid, validationError } = this.validate(createData);
		this.setState({ validationError: validationError, openEditor: undefined });
		if (!isValid) { return null; }
		return this.props.dispatch(postDiscussion(createData.replyRootPubId, createData.replyParentPubId, createData.title, createData.description, undefined, !this.props.discussion.isPublished));		
	},

	setOpenEditor: function(id, description, title) {
		this.setState({ openEditor: id, editDescription: description, editTitle: title });
	},

	discussionChange: function(evt) {
		this.setState({ editDescription: evt.target.value });
	},
	updateDiscussion: function() {
		this.props.dispatch(putDiscussion(this.state.openEditor, undefined, this.state.editDescription));
	},

	editTitleChange: function(evt) {
		this.setState({ editTitle: evt.target.value });
	},
	confirmEditTitle: function() {
		this.props.dispatch(putDiscussion(this.props.discussion.id, this.state.editTitle, undefined));
	},

	createReaction: function(reactionId) {

	},
	destroyReaction: function(reactionId) {

	},

	setReaction: function(pubId, replyRootPubId, reactionId, reactionSet) {
		if (!this.props.accountId) { return false; }

		if (reactionSet) {
			return this.props.dispatch(deleteReaction(pubId, replyRootPubId, reactionId, this.props.accountId));
		}
		return this.props.dispatch(postReaction(pubId, replyRootPubId, reactionId));
	},

	render: function() {
		const discussion = this.props.discussion || {};
		const pub = this.props.pub || {};
		const pubLabels = pub.pubLabels || [];
		const children = discussion.children || [];
		const allReactions = pub.allReactions || [];
		const isLoading = this.props.isLoading;

		const errorMessage = this.state.validationError || this.props.error;

		const discussions = [discussion, ...children];

		return (
			<div style={styles.container} className={'discussion-item'}>
				<Style rules={{
					'.discussion-item .pt-button-group:not(.pt-vertical) .pt-popover-target, .discussion-item .pt-button-group:not(.pt-vertical) .pt-tether-target': { float: 'none' },
				}} />

				{this.state.openEditor !== 'title' &&
					<h3>
						{discussion.title}
						{discussion.contributors && discussion.contributors[0].user.id === this.props.accountId &&
							<button className={'pt-button pt-minimal pt-icon-edit'} onClick={this.setOpenEditor.bind(this, 'title', undefined, discussion.title)} />
						}
					</h3>
				}

				{this.state.openEditor === 'title' &&
					<div>
						<input type="text" value={this.state.editTitle} onChange={this.editTitleChange} />
						<hr />
						<button className={'pt-button'} onClick={this.setOpenEditor.bind(this, undefined)}>Cancel</button>
						<button className={'pt-button pt-intent-primary'} onClick={this.confirmEditTitle}>Save</button>
						<div style={styles.loaderContainer}>
							<Loader loading={isLoading} showCompletion={!errorMessage} />
						</div>
					</div>
				}

				{!discussion.isPublished && 
					<div className={'pt-callout'}>
						<span className={'pt-icon-standard pt-icon-lock'} /> Private	
					</div>
					
				}
				
				<PubLabelList 
					allLabels={pubLabels} 
					selectedLabels={discussion.labels} 
					pubId={discussion.id} 
					rootPubId={this.props.pub.id} 
					canEdit={pub.canEdit} 
					pathname={this.props.pathname} 
					query={this.props.query} 
					dispatch={this.props.dispatch} />

				{discussions.sort((foo, bar)=>{
					// Sort so that oldest is first in array
					if (foo.createdAt > bar.createdAt) { return 1; }
					if (foo.createdAt < bar.createdAt) { return -1; }
					return 0;
				}).map((child, index)=> {
					const user = child.contributors[0].user;
					const isAuthor = user.id === this.props.accountId;
					const editorOpen = this.state.openEditor === child.id;
					const pubReactions = child.pubReactions || [];
					
					const usedReactions = {};
					pubReactions.map((PubReaction)=> {
						const reactionId = PubReaction.reactionId;
						if (reactionId in usedReactions) {
							usedReactions[reactionId].count += 1;
						} else {
							usedReactions[reactionId] = { count: 1, setByUser: false, reaction: PubReaction.reaction };
						}
						if (PubReaction.userId === this.props.accountId) {
							usedReactions[reactionId].setByUser = true;
						}

						
					});
					return (
						<div key={'discussion-' + index} style={styles.discussionItem}>
							<div style={styles.discussionItemHeader}>
								<div style={styles.discussionItemImageWrapper}>
									<img src={'https://jake.pubpub.org/unsafe/50x50/' + user.avatar} style={styles.discussionItemImage} />	
								</div>
								
								<div style={styles.discussionItemName}>
									{user.firstName + ' ' + user.lastName} · {dateFormat(child.createdAt, 'mmm dd, yyyy')}
								</div>

								<div style={styles.discussionItemActions} className="pt-button-group pt-minimal">	
									<Tooltip content={'Add Feedback'} position={Position.LEFT} useSmartPositioning={true}>						
										<Popover 
											content={
												<div style={styles.reactionMenu}>
													{allReactions.map((reaction)=> {
														const reactionSet = usedReactions[reaction.id] && usedReactions[reaction.id].setByUser;
														const classes = reactionSet
															? 'pt-button pt-minimal pt-active'
															: 'pt-button pt-minimal';
														return <button key={'reaction-' + reaction.id} className={classes} style={styles.reactionItem} onClick={this.setReaction.bind(this, child.id, child.replyRootPubId, reaction.id, reactionSet)}>{reaction.title}</button>;
													})}
												</div>
											}
											popoverClassName={'pt-minimal'}
											position={Position.BOTTOM_RIGHT} >
											<button type="button" className="pt-button pt-icon-social-media" />
										</Popover>
									</Tooltip>
									{isAuthor &&
										<Tooltip content={'Edit'} position={Position.LEFT} useSmartPositioning={true}>						
											<button type="button" className="pt-button pt-icon-edit" onClick={this.setOpenEditor.bind(this, child.id, child.description)} />
										</Tooltip>
									}
									<Tooltip content={'Cite Discussion'} position={Position.LEFT} useSmartPositioning={true}>						
										
										<Popover 
											content={
												<div style={styles.reactionMenu}>
													Here is how to cite this discussion.
													Permalink: https://www.pubpub.org{this.props.pathname}?discussionId={child.id}
													{/* This permalink isn't right, we need to pass the slug in, we don't want the whole route. */}
												</div>
											}
											popoverClassName={'pt-minimal'}
											position={Position.BOTTOM_RIGHT} >
											<button type="button" className="pt-button pt-icon-bookmark" />
										</Popover>
									</Tooltip>

								</div>
							</div>
							{!editorOpen && 
								<div style={styles.discussionItemBody} className={'discussion-body'}>
									<ReactMarkdown source={child.description} />
								</div>
							}
							{editorOpen && 
								<div style={styles.discussionItemBody} className={'discussion-body'}>
									<textarea value={this.state.editDescription} onChange={this.discussionChange} />
									<hr />
									<button className={'pt-button'} onClick={this.setOpenEditor.bind(this, undefined)}>Cancel</button>
									<button className={'pt-button pt-intent-primary'} onClick={this.updateDiscussion}>Save</button>
									<div style={styles.loaderContainer}>
										<Loader loading={isLoading} showCompletion={!errorMessage} />
									</div>
								</div>
							}

							{!editorOpen && 
								<div style={{ padding: '0.5em' }}>
									{Object.keys(usedReactions).sort((foo, bar)=> {
										if (usedReactions[foo].count > usedReactions[bar].count) { return -1; }
										if (usedReactions[foo].count < usedReactions[bar].count) { return 1; }
										return 0;
									}).map((reactionId)=> {
										return (
											<div key={'reaction-count-' + child.id + '-' + reactionId} style={styles.reactionCount} className={'pt-tag'}>{usedReactions[reactionId].reaction.title} | {usedReactions[reactionId].count}</div>
										);
									})}
								</div>
							}
							
							
						</div>
					);
				})}

				<hr />

				<form onSubmit={this.createSubmit}>
					<h3>Reply</h3>
					<textarea id={'description'} name={'description'} type="text" style={[styles.input, styles.description]} value={this.state.description} onChange={this.inputUpdate.bind(this, 'description')} />
					

					<button className={'pt-button pt-intent-primary'} onClick={this.createSubmit}>
						Post Reply
					</button>

					{!this.state.openEditor &&
						<div style={styles.loaderContainer}>
							<Loader loading={isLoading} showCompletion={!errorMessage} />
						</div>
					}
					

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
			</div>
		);
	}
});

export default Radium(PubDiscussion);

styles = {
	container: {
		
	},
	discussionItem: {
		border: '1px solid #CCC',
		margin: '1em 0em',
	},
	discussionItemHeader: {
		display: 'table',
		width: '100%',
	},
	discussionItemImageWrapper: {
		display: 'table-cell',
		width: '1%',
		paddingRight: '.5em',
	},
	discussionItemImage: {
		width: '50px',
		display: 'block',
	},
	discussionItemName: {
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	discussionItemActions: {
		display: 'table-cell',
		whiteSpace: 'nowrap',
		width: '1%',
		verticalAlign: 'middle',
	},
	discussionItemBody: {
		backgroundColor: 'white',
		padding: '1em 1em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	description: {
		height: '8em',
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	reactionMenu: {
		maxWidth: '250px',
	},
	reactionItem: {
		margin: '.5em',
	},
	reactionCount: {
		marginRight: '0.5em',
	},
};
