import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import DiscussionsInput from './DiscussionsInput';
import DiscussionsScore from './DiscussionsScore';

import {convertListToObject} from '../../utils/parsePlugins';
import PPMComponent from '../../markdown/PPMComponent';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl';

let styles = {};

const DiscussionsItem = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		discussionItem: PropTypes.object,
		instanceName: PropTypes.string,
		isPubAuthor: PropTypes.bool,

		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,

		activeSaveID: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
		handleArchive: PropTypes.func,

		noPermalink: PropTypes.bool,
		noReply: PropTypes.bool,
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

		const assets = convertListToObject( discussionItem.assets );
		const references = convertListToObject(discussionItem.references, true);
		const selections = discussionItem.selections || [];
		const isArchived = discussionItem.archived;

		// console.log(discussionItem);
		const discussionPoints = discussionItem.points ? discussionItem.points : 0; // This is to fix a NaN problem with newly published comments/discussions

		return (
			isArchived && !this.state.showArchived
				? <div style={[styles.archivedContainer, globalStyles.ellipsis]} key={'archiveBlock-' + discussionItem._id} onClick={this.toggleShowArchived}>
					Archived
					<span style={{padding: '0px 20px'}}>Comment by {discussionItem.author.name}</span>
					{(discussionPoints + 1) === 1 ? (discussionPoints + 1) + ' point' : (discussionPoints + 1) + ' points'}
				</div>
				: <div style={[styles.container, isArchived && styles.archived]}>
					<div style={styles.discussionHeader}>

						<div style={styles.discussionVoting}>
							<DiscussionsScore
								discussionID={discussionItem._id}
								score={discussionPoints}
								userYay={discussionItem.userYay}
								userNay={discussionItem.userNay}
								handleVoteSubmit={this.props.handleVoteSubmit}
								readOnly={this.props.noReply}/>
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
								(((new Date() - new Date(discussionItem.postDate)) / (1000 * 60 * 60 * 24)) < 7)
								? <FormattedRelative value={discussionItem.postDate} />
								: <FormattedDate value={discussionItem.postDate} />
							}
						</div>

						<div style={[styles.discussionDetailsLine, styles.discussionDetailsLineBottom]}>
							<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/discussions/' + discussionItem._id}>
							<span style={[styles.detailLineItem, this.props.noPermalink && {display: 'none'}]}>
								<FormattedMessage
									id="discussion.permalink"
									defaultMessage="Permalink"/>
							</span>
							</Link>

							<span style={[styles.detailLineItemSeparator, (this.props.noReply || this.props.noPermalink) && {display: 'none'}]}>|</span>

							<span style={[styles.detailLineItem, this.props.noReply && {display: 'none'}]} key={'replyButton-' + discussionItem._id} onClick={this.toggleReplyActive}>
								<FormattedMessage
									id="discussion.reply"
									defaultMessage="Reply"/>
							</span>

							{this.props.isPubAuthor
								? <span>
									<span style={[styles.detailLineItemSeparator, (this.props.noReply && this.props.noPermalink) && {display: 'none'}]}>|</span>
									<span style={[styles.detailLineItem, this.props.noReply && {display: 'none'}]} key={'archiveButton-' + discussionItem._id} onClick={this.archive}>
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

					<div style={styles.discussionBody}>

						<div style={styles.discussionContent}>

							{/* md.tree */}
							<PPMComponent assets={assets} references={references} selections={selections} markdown={discussionItem.markdown} />

						</div>
					</div>

					{this.props.noReply
						? null
						: <div style={[styles.replyWrapper, this.state.replyActive && styles.replyWrapperActive]}>
							<DiscussionsInput
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus}
								newDiscussionData={this.props.newDiscussionData}
								userThumbnail={this.props.userThumbnail}
								codeMirrorID={this.props.instanceName + 'replyInput-' + discussionItem._id}
								parentID={discussionItem._id}
								saveID={discussionItem._id}
								activeSaveID={this.props.activeSaveID}
								isReply={true}/>
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

									activeSaveID={this.props.activeSaveID}
									addDiscussionHandler={this.props.addDiscussionHandler}
									addDiscussionStatus={this.props.addDiscussionStatus}
									newDiscussionData={this.props.newDiscussionData}
									userThumbnail={this.props.userThumbnail}
									handleVoteSubmit={this.props.handleVoteSubmit}
									handleArchive={this.props.handleVoteSubmit}
									noReply={this.props.noReply}
									noPermalink={this.props.noPermalink}/>

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
		margin: '15px 0px 10px 0px',
		backgroundColor: 'rgba(255,255,255,0.2)',
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
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderBottom: '1px solid #eee',
		':hover': {
			color: '#444',
			cursor: 'pointer',
		},
	},
	authorName: {
		/* borderBottom: '1px solid #bbb', */
		fontWeight: 700,
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
		color: '#777',
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
		color: '#777',
		':hover': {
			color: '#333',
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
		borderBottom: '1px solid #eee',
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
		width: 'calc(100% - 30px)',
		marginLeft: 25,
		// overflow: 'hidden',
		color: '#555',
		// padding: '0px 15px',
		padding: '10px 6px 15px 6px',
		lineHeight: '1.58',
		fontSize: '0.9em',
		fontWeight: '300',
		fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
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
