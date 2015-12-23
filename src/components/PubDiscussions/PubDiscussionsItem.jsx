import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import PubDiscussionsInput from './PubDiscussionsInput';

import marked from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
marked.setExtensions(markdownExtensions);

let styles = {};

const PubDiscussionsItem = React.createClass({
	propTypes: {
		discussionItem: PropTypes.object,
		pHashes: PropTypes.object,

		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,

		activeSaveID: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			discussionItem: {
				selections: [],
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
					const renderer = new Marklib.Rendering(document, {className: 'selection'}, document.getElementById('pubBodyContent'));
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
		// console.log(discussionItem);
		const md = marked(discussionItem.markdown || '', Object.values({} || {}));
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

					<div style={styles.discussionDetailsLineBottom}>
						Mark Expert | Flag | <span onClick={this.toggleReplyActive}>Reply</span>
					</div>

				</div>

				<div style={styles.discussionBody}>
					<div style={styles.discussionVoting}>
						<div style={styles.voteUp}>^</div>
						<div style={styles.voteScore}>{discussionItem.yays - discussionItem.nays}</div>
						<div style={styles.voteDown}>^</div>
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
								pHashes={this.props.pHashes}
								discussionItem={child}

								activeSaveID={this.props.activeSaveID}
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus} 
								newDiscussionData={this.props.newDiscussionData} 
								userThumbnail={this.props.userThumbnail} />
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
		overflow: 'hidden',
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
	headerText: {
		color: '#777',
		':hover': {
			color: '#333',
			cursor: 'pointer',
		}
	},
	discussionDetailsLineBottom: { 
		// We are explicitly repeating ourselves here because Radium seems to have an issue with
		// handling arrays of styles in nested components.
		// Didn't spend too much time on it, just figured I'd dupe the style.
		// Before, it was [styles.discusionDetailsLine, styles. discussionDetailsLineBottom]
		// with discussionDetailsLineBottom only containing 'lineHeight: 18px'
		height: 18,
		lineHeight: '18px',
		width: 'calc(100% - 36px - 5px)',
		paddingLeft: 5,
		color: '#777',
		fontSize: '13px',
		float: 'left',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
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
	voteUp: {
		// backgroundColor: 'rgba(0,0,100,0.2)',
		// fontFamily: 'Courier',
		height: 20,
		lineHeight: '38px',
		fontSize: '28px',
		color: '#aaa',
	},
	voteScore: {
		// backgroundColor: 'rgba(255,100,100,0.2)',
		color: '#888',
		fontFamily: 'Lato',
		// fontWeight: 'bold',

	},
	voteDown: {
		// backgroundColor: 'rgba(0,0,100,0.2)',
		// fontFamily: 'Courier',
		height: 20,
		lineHeight: '38px',
		fontSize: '28px',
		color: '#aaa',
		transform: 'rotate(180deg)',
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
