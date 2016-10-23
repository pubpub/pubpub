import dateFormat from 'dateformat';
import Radium from 'radium';
import React, {PropTypes} from 'react';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {FormattedMessage} from 'react-intl';
import { Link } from 'react-router';
import {globalMessages} from 'utils/globalMessages';
import {globalStyles} from 'utils/styleConstants';
// import {safeGetInToJS} from 'utils/safeParse';

let styles = {};

export const DiscussionThreadHeader = React.createClass({
	propTypes: {
		discussionData: PropTypes.object,
		userID: PropTypes.string,
		setReplyTo: PropTypes.func,
		index: PropTypes.string,
		isPreview: PropTypes.bool,
		linkTarget: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
		setActiveThread: PropTypes.func,
	},

	getInitialState() {
		return {
		};
	},


	clickedTopic: function() {
		const discussion = this.props.discussionData || {};
		const atomData = discussion.atomData || {};
		this.props.setActiveThread(atomData._id);
	},

	countChildren: function(discussionData) {
		if (!discussionData || !discussionData.children) {
			return 0;
		}
		let count = discussionData.children.length;
		for (const child of discussionData.children) {
			count += this.countChildren(child);
		}
		return count;
	},

	render: function() {
		const discussion = this.props.discussionData || {};
		const atomData = discussion.atomData || {};
		const versionData = discussion.versionData || {};
		const authorsData = discussion.authorsData || [];

		const date = versionData.createDate;

		const replies = this.countChildren(this.props.discussionData);

		return (
			<div style={styles.container} onClick={this.clickedTopic}>
				<div style={styles.discussionHeader}>
						<div style={styles.headerTitle}>{atomData.title.substring(0, 5) === 'Reply' ? ('Discussion by ' + authorsData[0].source.name) : atomData.title}</div>
						<span style={styles.headerDate}>{dateFormat(date, 'mmm dd, yyyy')}</span>
				</div>
				<div style={[styles.discussionFooter]}>
					<img style={styles.image} src={'https://jake.pubpub.org/unsafe/35x35/' + authorsData[0].source.image} />
					<span style={styles.discussionFooterItem}>{authorsData[0].source.name}</span>
					<span style={styles.spacer}>,</span>
					<span style={styles.discussionFooterItem}>
						<FormattedMessage
              id="discussions.replyCount"
              defaultMessage={`{replies, number} {replies, plural,
                one {reply}
                other {replies}
              }`}
              values={{replies}}
          />
					</span>
				</div>
			</div>
		);
	}
});

// const WrappedDiscussionItem = Radium(DiscussionItem);
export default Radium(DiscussionThreadHeader);

styles = {
	container: {
		padding: '1em 0em 1em 1em',
		borderBottom: '1px solid #CCC',
		cursor: 'pointer',
		borderLeft: '2px solid transparent',
		margin: '0em -2em',
		':hover': {
			borderLeft: '2px solid #58585B'
		}
	},
	spacer: {
		fontSize: '0.6em',
		padding: '0px 0.5em 0em 0.1em',
		color: '#58585B',
	},
	image: {
		width: '18px',
		verticalAlign: 'middle',
		marginRight: '8px',
		borderRadius: '1px'
	},
	discussionFooter: {
	},
	discussionFooterItem: {
		padding: '0em 0em 0em 0em',
		fontSize: '0.75em',
		color: '#58585B',
	},
	discussionHeader: {
		width: '100%',
	},
	headerTitle: {
		paddingBottom: '0.3em',
		width: '60%',
		display: 'inline-block'
	},
	headerDate: {
		fontSize: '0.75em',
		color: '#58585B',
		width: '35%',
		display: 'inline-block',
		textAlign: 'right',
	},

};
