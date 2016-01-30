import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import DiscussionsInput from './DiscussionsInput';
import DiscussionsScore from './DiscussionsScore';

import {convertListToObject} from '../../utils/parsePlugins';
import PPMComponent from '../../markdown/PPMComponent';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const DiscussionsItem = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		discussionItem: PropTypes.object,
		instanceName: PropTypes.string,

		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,

		activeSaveID: PropTypes.string,
		handleVoteSubmit: PropTypes.func,

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

	render: function() {

		const discussionItem = this.props.discussionItem;

		const assets = convertListToObject( discussionItem.assets );
		const references = convertListToObject(discussionItem.references, true);
		const selections = discussionItem.selections || [];

		return (
			<div style={styles.container}>
				
				<div style={styles.discussionHeader}>

					<div style={styles.discussionAuthorImageWrapper}>
						<Link to={'/user/' + discussionItem.author.username} style={globalStyles.link}>
							<img style={styles.discussionAuthorImage} src={discussionItem.author.thumbnail} />
						</Link>
					</div>
					<div style={styles.discussionDetailsLine}>
						<Link to={'/user/' + discussionItem.author.username} style={globalStyles.link}><span key={'discussionItemAuthorLink' + discussionItem._id} style={styles.headerText}>{discussionItem.author.name}</span></Link> on {dateFormat(discussionItem.postDate, 'mm/dd/yy, h:MMTT')}
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
					</div>

				</div>

				<div style={styles.discussionBody}>
					<div style={styles.discussionVoting}>
						<DiscussionsScore 
							discussionID={discussionItem._id}
							score={discussionItem.yays - discussionItem.nays}
							userYay={discussionItem.userYay}
							userNay={discussionItem.userNay} 
							handleVoteSubmit={this.props.handleVoteSubmit} 
							readOnly={this.props.noReply}/>
					</div>

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

								activeSaveID={this.props.activeSaveID}
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus} 
								newDiscussionData={this.props.newDiscussionData} 
								userThumbnail={this.props.userThumbnail} 
								handleVoteSubmit={this.props.handleVoteSubmit} 
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
		margin: '10px 0px',
		backgroundColor: 'rgba(255,255,255,0.2)',
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
	},
	discussionDetailsLine: {
		height: 18,
		lineHeight: '16px',
		width: 'calc(100% - 36px - 5px)',
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
	},
	discussionBody: {
		width: '100%',
		position: 'relative',
		minHeight: 82,
		borderBottom: '1px solid #ccc',
	},
	discussionVoting: {
		width: '36',
		height: 72,
		position: 'absolute',
		top: 0,
		left: 0,
		fontSize: '20px',
		textAlign: 'center',
		padding: '5px 0px',
		fontFamily: 'Courier',
		// backgroundColor: 'rgba(255,0,100,0.2)',
	},
	discussionContent: {
		width: 'calc(100% - 36px - 30px)',
		marginLeft: 36,
		// overflow: 'hidden',
		fontFamily: 'Arial',
		color: '#555',
		fontSize: '15px',
		// padding: '0px 15px',
		padding: '10px 6px',

	},
	discussionChildrenWrapper: {
		width: 'calc(100% - 20px)',
		marginLeft: 20,
		// borderLeft: '1px solid #ccc',
		// borderTop: '1px solid #ccc',
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
