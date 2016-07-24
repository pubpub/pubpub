import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import DiscussionsInput from './DiscussionsInput';
import DiscussionsScore from './DiscussionsScore';

import {Markdown} from 'components';

// import ResizingText from '../../components/PubBody/ResizingText';

// import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl';

let styles = {};

const DiscussionsItem = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		discussionItem: PropTypes.object,
		// instanceName: PropTypes.string,
		isPubAuthor: PropTypes.bool,

		isCollaborator: PropTypes.bool,
		isPublished: PropTypes.bool,

		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		// newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,

		activeSaveID: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
		handleArchive: PropTypes.func,

		toggleMediaLibrary: PropTypes.func,
		// noPermalink: PropTypes.bool,
		// noReply: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			discussionItem: {
				selections: [],
				children: [],
			},
		};
	},

	getInitialState() {
		return {
			replyActive: false,
			showArchived: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.addDiscussionStatus === 'loading' && this.props.activeSaveID === this.props.discussionItem._id && nextProps.addDiscussionStatus === 'loaded') {
			this.setState({replyActive: false});
		}
	},

	toggleReplyActive: function() {
		this.setState({
			replyActive: !this.state.replyActive,
		});
	},

	archive: function() {
		this.props.handleArchive(this.props.discussionItem._id);
	},

	toggleShowArchived: function() {
		this.setState({
			showArchived: !this.state.showArchived
		});
	},

	render: function() {
		const discussionItem = this.props.discussionItem;
		const isArchived = discussionItem.archived;
		const discussionPoints = discussionItem.points ? discussionItem.points : 0; // This is to fix a NaN problem with newly published comments/discussions

		return (
			isArchived && !this.state.showArchived
				? <div style={[styles.archivedContainer, globalStyles.ellipsis]} key={'archiveBlock-' + discussionItem._id} onClick={this.toggleShowArchived}>
					Archived
					<span style={{padding: '0px 20px'}}>Comment by {discussionItem.author.name}</span>
					{(discussionPoints + 1) === 1 ? (discussionPoints + 1) + ' point' : (discussionPoints + 1) + ' points'}
				</div>
				: <div className={'discussion-item'} style={[styles.container, isArchived && styles.archived]}> {/* The classname discussion-item is used by selectionPlugin*/}
					<div style={[styles.discussionHeader]}>

						<div style={styles.discussionVoting}>
							<DiscussionsScore
								discussionID={discussionItem._id}
								score={discussionPoints}
								userYay={discussionItem.userYay}
								userNay={discussionItem.userNay}
								handleVoteSubmit={this.props.handleVoteSubmit}/>
						</div>

						<div style={styles.discussionAuthorImageWrapper}>
							<Link to={'/user/' + discussionItem.author.username} style={globalStyles.link}>
								<img style={styles.discussionAuthorImage} src={discussionItem.author.thumbnail} />
							</Link>
						</div>
						<div style={styles.discussionDetailsLine}>
							<Link to={'/user/' + discussionItem.author.username} style={globalStyles.link}>
								<span key={'discussionItemAuthorLink' + discussionItem._id} style={[styles.headerText, styles.authorName]}>{discussionItem.author.name}</span>
							</Link> <span style={styles.dot}>●</span> {
								(((new Date() - new Date(discussionItem.createDate)) / (1000 * 60 * 60 * 24)) < 7)
								? <FormattedRelative value={discussionItem.createDate} />
							: <FormattedDate value={discussionItem.createDate || new Date()} />
							}
						</div>

						<div style={[styles.discussionDetailsLine, styles.discussionDetailsLineBottom]}>
							<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/discussions/' + discussionItem._id}>
							<span style={[styles.detailLineItem]}>
								<FormattedMessage id="discussion.permalink" defaultMessage="Permalink"/>
							</span>
							</Link>

							<span style={[styles.detailLineItemSeparator]}>|</span>
							<span style={[styles.detailLineItem]} key={'replyButton-' + discussionItem._id} onClick={this.toggleReplyActive}>
								<FormattedMessage id="discussion.reply" defaultMessage="Reply"/>
							</span>

							{/* <span style={[styles.detailLineItemSeparator, !discussionItem.isAuthor && styles.hide]}>|</span>
							<span style={[styles.detailLineItem, !discussionItem.isAuthor && styles.hide]} key={'editButton-' + discussionItem._id} onClick={this.edit}>
								<FormattedMessage id="discussion.edit" defaultMessage="Edit"/>
							</span> */}

							{/* <span style={[styles.detailLineItemSeparator, discussionItem.isAuthor && styles.hide]}>|</span>
							<span style={[styles.detailLineItem, discussionItem.isAuthor && styles.hide]} key={'flagButton-' + discussionItem._id} onClick={this.toggleFlag}>
								<FormattedMessage id="discussion.flag" defaultMessage="Flag"/>
							</span> */}

							{this.props.isPubAuthor
								? <span>
									<span style={[styles.detailLineItemSeparator]}>|</span>
									<span style={[styles.detailLineItem]} key={'archiveButton-' + discussionItem._id} onClick={this.archive}>
										{isArchived
											? <FormattedMessage id="discussion.Unarchive" defaultMessage="Unarchive"/>
											: <FormattedMessage id="discussion.Archive" defaultMessage="Archive"/>
										}
									</span>
								</span>
								: null
							}

							{isArchived
								? <span>
									<span style={[styles.detailLineItemSeparator, (this.props.noReply && this.props.noPermalink && !this.props.isPubAuthor) && {display: 'none'}]}>|</span>
									<span style={[styles.detailLineItem, this.props.noReply && {display: 'none'}]} key={'archiveShowButton-' + discussionItem._id} onClick={this.toggleShowArchived}>
										<FormattedMessage id="discussion.Archived" defaultMessage="Collapse"/>
									</span>
								</span>
								: null
							}

						</div>

					</div>

					{/* <ResizingText
						fontRatio={35}
						mobileFontRatio={20}
						minFont={14}
						maxFont={18}
						paddingType="right"> */}

					<div style={styles.discussionBody}>

						<div style={styles.discussionContent}>
							<div style={[styles.privateBlock, discussionItem.private && {display: 'inline-block'}]}>

								<FormattedMessage id="discussion.PrivateCollaboraotrsOnly" defaultMessage="Private. Collaborators only."/>
							</div>
							{/* md.tree */}
							<Markdown markdown={discussionItem.markdown} />

						</div>
					</div>

					{/* </ResizingText> */}

					{!this.state.replyActive
						? null
						: <div style={[styles.replyWrapper, styles.replyWrapperActive]}>
							<DiscussionsInput
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus}
								userThumbnail={this.props.userThumbnail}
								codeMirrorID={'replyInput-' + discussionItem._id}
								parentID={discussionItem._id}
								isCollaborator={this.props.isCollaborator}
								parentIsPrivate={discussionItem.private}
								saveID={discussionItem._id}
								activeSaveID={this.props.activeSaveID}
								isReply={true}
								isPublished={this.props.isPublished}
								toggleMediaLibrary={this.props.toggleMediaLibrary}/>
						</div>

					}

					{/* Children */}
					<div style={styles.discussionChildrenWrapper}>
						{
							discussionItem.children.map((child)=>{
								return (<ChildPubDiscussionItem
									key={child._id}
									slug={this.props.slug}
									discussionItem={child}
									isPubAuthor={this.props.isPubAuthor}
									isCollaborator={this.props.isCollaborator}
									isPublished={this.props.isPublished}
									activeSaveID={this.props.activeSaveID}
									addDiscussionHandler={this.props.addDiscussionHandler}
									addDiscussionStatus={this.props.addDiscussionStatus}
									userThumbnail={this.props.userThumbnail}
									handleVoteSubmit={this.props.handleVoteSubmit}
									handleArchive={this.props.handleVoteSubmit}
									toggleMediaLibrary={this.props.toggleMediaLibrary}/>

								);
							})
						}
					</div>


				</div>
		);
	}
});

const ChildPubDiscussionItem = Radium(DiscussionsItem);
export default Radium(DiscussionsItem);

styles = {
	container: {
		width: '100%',
		// overflow: 'hidden',
		margin: '15px 0px 0px 0px',
		// backgroundColor: 'rgba(255,255,255,0.2)',
		clear: 'both',
	},
	archived: {
		opacity: 0.7,
	},
	archivedContainer: {
		color: '#777',
		width: 'calc(100% - 20px)',
		// margin: '4px 0px',
		height: '17px',
		lineHeight: '17px',
		padding: '0px 10px',
		fontSize: '12px',
		// backgroundColor: 'rgba(255,255,255,0.2)',
		borderBottom: '1px solid #DDD',
		':hover': {
			color: '#444',
			cursor: 'pointer',
		},
	},
	authorName: {
		/* borderBottom: '1px solid #bbb', */
		fontWeight: 700,
	},
	hide: {
		display: 'none',
	},
	discussionHeader: {
		height: 36,
		width: '100%',
	},
	discussionAuthorImageWrapper: {
		height: 30,
		width: 30,
		padding: 3,
		float: 'left',
	},
	discussionAuthorImage: {
		width: '100%',
		height: '100%',
		borderRadius: '2px',
	},
	discussionDetailsLine: {
		height: 18,
		lineHeight: '16px',
		width: 'calc(100% - 36px - 36px - 5px)',
		paddingLeft: 5,
		color: '#333',
		fontSize: '13px',
		float: 'left',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	detailLineItem: {
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: '#000',
		}
	},
	detailLineItemSeparator: {
		padding: '0px 6px',
	},
	headerText: {
		color: '#555',
		fontFamily: 'Lora',
		':hover': {
			color: '#000',
			cursor: 'pointer',
		}
	},
	discussionDetailsLineBottom: {
		lineHeight: '18px',
		fontSize: '0.7em',
	},
	discussionBody: {
		width: '100%',
		position: 'relative',
		borderBottom: '1px solid #ddd',
		// overflow: 'hidden',
		wordWrap: 'break-word',
	},
	discussionVoting: {
		width: '25px',
		height: '36px',
		float: 'left',
		fontSize: '12px',
		textAlign: 'center',
		padding: '3px 0px',
		fontFamily: 'Courier',
		// backgroundColor: 'rgba(255,0,100,0.2)',
	},
	discussionContent: {
		width: 'calc(100% -12px)',
		// marginLeft: 25,
		// overflow: 'hidden',
		color: '#222',
		// padding: '0px 15px',
		padding: '10px 6px 15px 6px',
		lineHeight: '1.58',
		fontSize: '1em',
		fontWeight: '300',
		fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
	},
	privateBlock: {
		textAlign: 'center',
		display: 'none',
		backgroundColor: '#444',
		color: 'white',
		borderRadius: '1px',
		padding: '0px 10px',
		fontSize: '0.8em',

	},
	discussionChildrenWrapper: {
		width: 'calc(100% - 20px)',
		marginLeft: 20,
		// borderLeft: '1px solid #ccc',
		// borderTop: '1px solid #ccc',
	},
	dot: {
		fontSize: '0.50em',
		padding: '0px 3px',
		position: 'relative',
		top: '-2px',
		color: '#999',
	},
	replyWrapper: {
		width: 'calc(100% - 20px)',
		marginLeft: 20,
		position: 'absolute',
		pointerEvents: 'none',
		opacity: 0,
	},
	replyWrapperActive: {
		position: 'relative',
		pointerEvents: 'auto',
		opacity: 1,
	}
};
