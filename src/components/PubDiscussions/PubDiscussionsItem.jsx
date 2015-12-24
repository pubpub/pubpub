import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import PubDiscussionsInput from './PubDiscussionsInput';
import PubDiscussionsScore from './PubDiscussionsScore';

import marked from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
marked.setExtensions(markdownExtensions);

let styles = {};

const PubDiscussionsItem = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		discussionItem: PropTypes.object,
		pHashes: PropTypes.object,

		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,

		activeSaveID: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			discussionItem: {
				selections: [],
				children: [],
			},
			pHashes: {},
		};
	},

	getInitialState() {
		return {
			replyActive: false,
		};
	},

	componentDidMount() {
		// Go through all the selections and add them to the body
		const Marklib = require('marklib');
		this.props.discussionItem.selections.map((selection)=>{
			const pIndex = this.props.pHashes[selection.ancestorHash];
			if (pIndex) {
				try {
					const result = {
						startContainerPath: selection.startContainerPath.replace(/div:nth-of-type\((.*)\)/, 'div:nth-of-type(' + pIndex + ')'),
						endContainerPath: selection.endContainerPath.replace(/div:nth-of-type\((.*)\)/, 'div:nth-of-type(' + pIndex + ')'),
						startOffset: selection.startOffset,
						endOffset: selection.endOffset,
					};	
					const renderer = new Marklib.Rendering(document, {className: 'selection selection-' + selection._id}, document.getElementById('pubBodyContent'));
					renderer.renderWithResult(result);	
				} catch (err) {
					console.log('selection', err);
				}
			}

			
		});
		
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
		const assets = discussionItem.assets || [];
		const references = discussionItem.references || [];
		const selections = discussionItem.selections || [];
		const md = marked(discussionItem.markdown || '', {assets, references, selections});
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
						<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/discussions/' + discussionItem._id}><span style={styles.detailLineItem}>Permalink</span></Link>
						<span style={styles.detailLineItemSeparator}>|</span>
						<span style={styles.detailLineItem} key={'replyButton-' + discussionItem._id} onClick={this.toggleReplyActive}>Reply</span>
					</div>

				</div>

				<div style={styles.discussionBody}>
					<div style={styles.discussionVoting}>
						<PubDiscussionsScore 
							discussionID={discussionItem._id}
							score={discussionItem.yays - discussionItem.nays}
							userYay={discussionItem.userYay}
							userNay={discussionItem.userNay} 
							handleVoteSubmit={this.props.handleVoteSubmit} />
					</div>

					<div style={styles.discussionContent}>
						{md.tree}
					</div>
				</div>
				
				<div style={[styles.replyWrapper, this.state.replyActive && styles.replyWrapperActive]}>
					<PubDiscussionsInput 
						addDiscussionHandler={this.props.addDiscussionHandler}
						addDiscussionStatus={this.props.addDiscussionStatus} 
						newDiscussionData={this.props.newDiscussionData} 
						userThumbnail={this.props.userThumbnail}
						codeMirrorID={'replyInput-' + discussionItem._id} 
						parentID={discussionItem._id}
						saveID={discussionItem._id}
						activeSaveID={this.props.activeSaveID}
						isReply={true}/>
				</div>
				

				{/* Children */}
				<div style={styles.discussionChildrenWrapper}>
					{
						discussionItem.children.map((child)=>{
							return (<ChildPubDiscussionItem 
								key={child._id}
								slug={this.props.slug}
								pHashes={this.props.pHashes}
								discussionItem={child}

								activeSaveID={this.props.activeSaveID}
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus} 
								newDiscussionData={this.props.newDiscussionData} 
								userThumbnail={this.props.userThumbnail} 
								handleVoteSubmit={this.props.handleVoteSubmit} />
							);
						})
					}
				</div>
				

			</div>
		);
	}
});

const ChildPubDiscussionItem = Radium(PubDiscussionsItem);
export default Radium(PubDiscussionsItem);

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
		overflow: 'hidden',
		fontFamily: 'Arial',
		color: '#555',
		fontSize: '15px',
		padding: '0px 15px',

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
