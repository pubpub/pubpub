import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import dateFormat from 'dateformat';

import marked from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
marked.setExtensions(markdownExtensions);

let styles = {};

const PubDiscussionsItem = React.createClass({
	propTypes: {
		discussionItem: PropTypes.object,
		pHashes: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			discussionItem: {
				selections: [],
			},
		};
	},

	componentDidMount() {
		// Go through all the selections and add them to the body
		const Marklib = require('marklib');
		this.props.discussionItem.selections.map((selection)=>{
			const pIndex = this.props.pHashes[selection.ancestorHash];
			if (pIndex) {
				const result = {
					startContainerPath: selection.startContainerPath.replace(/p:nth-of-type\((.*)\)/, 'p:nth-of-type(' + pIndex + ')'),
					endContainerPath: selection.endContainerPath.replace(/p:nth-of-type\((.*)\)/, 'p:nth-of-type(' + pIndex + ')'),
					startOffset: selection.startOffset,
					endOffset: selection.endOffset,
				};	
				const renderer = new Marklib.Rendering(document, {className: 'selection'}, document.getElementById('pubBodyContent'));
				renderer.renderWithResult(result);	
			}

			
		});
		
	},

	render: function() {
		const discussionItem = this.props.discussionItem;
		// console.log(discussionItem);
		const md = marked(discussionItem.markdown, Object.values({} || {}));
		return (
			<div style={styles.container}>
				
				<div style={styles.discussionHeader}>

					<div style={styles.discussionAuthorImageWrapper}>
						<img style={styles.discussionAuthorImage} src={discussionItem.author.thumbnail} />
					</div>
					<div style={styles.discussionDetailsLine}>
						{discussionItem.author.name} on {dateFormat(discussionItem.postDate, 'mm/dd/yy, h:MMTT')}
					</div>

					<div style={styles.discussionDetailsLineBottom}>
						Mark Expert | Flag | Reply
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
				

				{/* Children */}
				<div style={styles.discussionChildrenWrapper}>
					{
						discussionItem.children.map((child)=>{
							return <PubDiscussionsItem key={child._id} discussionItem={child}/>;
						})
					}
				</div>
				

			</div>
		);
	}
});

export default Radium(PubDiscussionsItem);

styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		margin: '10px 0px',
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
	},
	discussionContent: {
		width: 'calc(100% - 36px)',
		marginLeft: 36,
		overflow: 'hidden',

	},
	discussionChildrenWrapper: {
		width: 'calc(100% - 10px)',
		paddingLeft: 20,
		// borderLeft: '1px solid #ccc',
		borderTop: '1px solid #ccc',
	}
};
