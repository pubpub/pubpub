import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';

import {Media} from 'containers';
import {schema} from 'components/AtomTypes/Document/proseEditor';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {StoppableSubscription} from 'subscription';

import {getDiscussionsData} from './actions';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};
let pm;

export const DiscussionItem = React.createClass({
	propTypes: {
		discussionData: PropTypes.object,
		index: PropTypes.string,
	},

	getInitialState() {
		return {
		};
	},

	render: function() {
		const discussion = this.props.discussionData || {};
		const index = this.props.index;
		const children = discussion.children || [];

		const docJSON = discussion.versionData.content.docJSON;
		const date = discussion.versionData.createDate;

		return (
			<div>
				<div style={styles.discussionHeader}>
					<div style={styles.headerVotes}>

					<div className={'lighter-bg-hover'} style={[styles.headerVote]}>^</div>
					<div className={'lighter-bg-hover'} style={[styles.headerVote, styles.headerDownVote]}>^</div>

					</div>
					<div style={styles.headerDetails}>
						{discussion.authorsData.map((authorLink, authorIndex)=> {
							return (
								<div key={'author-' + index + '-' + authorIndex} style={styles.headerAuthor}>
									<div style={styles.authorImage}>
										<img src={'https://jake.pubpub.org/unsafe/35x35/' + authorLink.source.image} />
									</div>	
									<div style={styles.authorDetails}>
										<div>{authorLink.source.name}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className={'atom-reply'} style={styles.discussionContent}>
					{renderReactFromJSON(docJSON && docJSON.content)}
				</div>
				<div style={styles.discussionFooter}>
					<span className={'underlineOnHover'} style={styles.discussionFooterItem}>{dateFormat(date, 'mmm dd, yyyy h:MM TT')}</span>
					<span className={'underlineOnHover'} style={styles.discussionFooterItem}>reply</span>
					<span className={'underlineOnHover'} style={styles.discussionFooterItem}>flag</span>
					<span className={'underlineOnHover'} style={styles.discussionFooterItem}>permalink</span>
				</div>

				<div style={styles.children}>
					{children.map((child, childIndex)=> {
						return <WrappedDiscussionItem discussionData={child} index={child.linkData._id} key={child.linkData._id}/>
					})}
				</div>
				
			</div>
		);
	}
});

const WrappedDiscussionItem = Radium(DiscussionItem);
export default WrappedDiscussionItem;

styles = {
	children: {
		paddingLeft: '1em',
		borderLeft: '1px solid #E0E0E0',
	},
	wsywigBlock: {
		width: '100%',
		minHeight: '4em',
		backgroundColor: 'white',
		margin: '0 auto',
		boxShadow: '0px 1px 3px 1px #BBBDC0',
	},
	discussionHeader: {
		display: 'table',
		position: 'relative',
		left: '-.4em',
		width: 'calc(100% + .4em)'
	},
	headerVotes: {
		display: 'table-cell',
		width: '1%',
		textAlign: 'center',
		verticalAlign: 'top',
	},
	headerVote: {
		padding: '0em .2em',
		height: '.6em',
		fontFamily: 'Courier',
		fontSize: '2em',
		lineHeight: '1.1em',
		cursor: 'pointer',
		color: '#808284',
		overflow: 'hidden',
	},
	headerDownVote: {
		transform: 'rotate(180deg)',
	},
	headerDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
		fontSize: '0.85em',
		color: '#58585B',
	},
	headerAuthor: {
		display: 'table',

	},
	authorImage: {
		display: 'table-cell',
		width: '1%',
		padding: '0em .5em 0em 0em',
		verticalAlign: 'top',
	},
	authorDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	discussionContent: {
		// padding: '1em 0em',
	},
	discussionFooter: {
		borderBottom: '1px solid #BBBDC0',
		marginBottom: '1em',
		paddingBottom: '1em',
	},
	discussionFooterItem: {
		padding: '0em 1em 0em 0em',
		fontSize: '0.75em',
		cursor: 'pointer',
		color: '#58585B',
	},

};
