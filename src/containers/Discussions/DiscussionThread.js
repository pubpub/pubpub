import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import DiscussionThreadInput from './DiscussionThreadInput';

let styles = {};

export const DiscussionThread = React.createClass({
	propTypes: {
		discussionData: PropTypes.object,
		userID: PropTypes.string,
		setReplyTo: PropTypes.func,
		index: PropTypes.string,
		isPreview: PropTypes.bool,
		linkTarget: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
		publishThreadReply: PropTypes.func,
	},

	getInitialState() {
		return {
		};
	},

	setReply: function() {
		this.props.setReplyTo(this.props.discussionData.atomData._id);
	},

	setFlag: function() {
		console.log('flagging');
	},

	vote: function(type) {
		const discussion = this.props.discussionData || {};
		const linkData = discussion.linkData || {};
		const hasYayd = discussion.linkData ? discussion.linkData.metadata.yays.indexOf(this.props.userID) !== -1 : false;
		const hasNayd = discussion.linkData ? discussion.linkData.metadata.nays.indexOf(this.props.userID) !== -1 : false;
		const remove = (hasYayd && type === 'yay') || (hasNayd && type === 'nay');
		this.props.handleVoteSubmit(type, linkData._id, remove);
	},

	render: function() {
		const discussion = this.props.discussionData || {};
		const atomData = discussion.atomData || {};
		const versionData = discussion.versionData || {};
		const authorsData = discussion.authorsData || [];
		const index = this.props.index;
		const children = discussion.children || [];

		const docJSON = versionData.content && versionData.content.docJSON;
		const date = versionData.createDate;

		const hasYayd = discussion.linkData ? discussion.linkData.metadata.yays.indexOf(this.props.userID) !== -1 : false;
		const hasNayd = discussion.linkData ? discussion.linkData.metadata.nays.indexOf(this.props.userID) !== -1 : false;

		return (
			<div>
				{discussion.linkData.destination === discussion.linkData.metadata.rootReply &&
					<div style={styles.threadTitle}>{atomData.title.substring(0, 5) === 'Reply' ? ('Discussion by ' + authorsData[0].source.name) : atomData.title}</div>
				}
				<div style={styles.discussionHeader}>

					<div style={styles.headerVotes}>
						<div className={'lighter-bg-hover'} style={[styles.headerVote, hasYayd && styles.voteActive]} onClick={this.vote.bind(this, 'yay')}>^</div>
						<div className={'lighter-bg-hover'} style={[styles.headerVote, styles.headerDownVote, hasNayd && styles.voteActive]} onClick={this.vote.bind(this, 'nay')}>^</div>
					</div>
					<div style={styles.headerDetails}>
						{authorsData.map((authorLink, authorIndex)=> {
							return (
								<div key={'author-' + index + '-' + authorIndex} style={styles.headerAuthor}>
									<div style={styles.authorImage}>
										<Link target={this.props.linkTarget} style={globalStyles.link} to={'/user/' + authorLink.source.username}><img src={'https://jake.pubpub.org/unsafe/35x35/' + authorLink.source.image} /></Link>
									</div>
									<div style={styles.authorDetails}>
										<Link target={this.props.linkTarget} style={globalStyles.link} to={'/user/' + authorLink.source.username}>{authorLink.source.name}</Link>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className={'atom-reply'} style={styles.discussionContent}>
					{!versionData.isPublished &&
						<div style={styles.privateDiscussion}>
							<FormattedMessage id="discussionItem.PrivateDiscussion2" defaultMessage="Private Discussion"/>						
						</div>
					}
					{renderReactFromJSON(docJSON && docJSON.content, true)}
				</div>
				<div style={[styles.discussionFooter, this.props.isPreview && {display: 'none'}]}>
					<Link target={this.props.linkTarget} style={globalStyles.link} to={'/pub/' + versionData.parent}><span className={'underlineOnHover'} style={styles.discussionFooterItem}>{dateFormat(date, 'mmm dd, yyyy h:MM TT')}</span></Link>
					<span className={'underlineOnHover'} style={styles.discussionFooterItem} onClick={this.setReply}>
						<FormattedMessage {...globalMessages.Reply}/>
					</span>
					{/* <span className={'underlineOnHover'} style={styles.discussionFooterItem} onClick={this.setFlag}>flag</span> */}
					<Link target={this.props.linkTarget} style={globalStyles.link} to={'/pub/' + versionData.parent}><span className={'underlineOnHover'} style={styles.discussionFooterItem}>
						<FormattedMessage {...globalMessages.Permalink}/>
					</span></Link>

					<div id={'input-placeholder-' + atomData._id}></div>

				</div>

				<div style={styles.children}>
					{children.sort((foo, bar)=> {
						const fooScore = foo.linkData.metadata.yays.length - foo.linkData.metadata.nays.length;
						const barScore = bar.linkData.metadata.yays.length - bar.linkData.metadata.nays.length;
						if (fooScore > barScore) { return -1; }
						if (fooScore < barScore) { return 1; }
						return 0;
					}).map((child, childIndex)=> {
						return <WrappedDiscussionThread linkTarget={this.props.linkTarget} discussionData={child} userID={this.props.userID} setReplyTo={this.props.setReplyTo} index={child.linkData._id} key={child.linkData._id} handleVoteSubmit={this.props.handleVoteSubmit}/>;
					})}
				</div>

				{discussion.linkData.destination === discussion.linkData.metadata.rootReply &&
					<DiscussionThreadInput publishThreadReply={this.props.publishThreadReply} />
				}
				

			</div>
		);
	}
});

const WrappedDiscussionThread = Radium(DiscussionThread);
export default WrappedDiscussionThread;

styles = {
	children: {
		// paddingLeft: '1em',
		// borderLeft: '1px solid #E0E0E0',
	},
	// wsywigBlock: {
	// 	width: '100%',
	// 	minHeight: '4em',
	// 	backgroundColor: 'white',
	// 	margin: '0 auto',
	// 	boxShadow: '0px 1px 3px 1px #BBBDC0',
	// },
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
	voteActive: {
		color: 'black',
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
	privateDiscussion: {
		backgroundColor: '#363736',
		color: '#F3F3F4',
		textAlign: 'center',
		borderRadius: '1px',
		fontSize: '0.85em',
	},
	threadTitle: {
		fontWeight: 'bold',
		padding: '1em 0em',
		fontSize: '1.2em',
	},

};
