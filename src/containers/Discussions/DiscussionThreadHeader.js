import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

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

	render: function() {
		const discussion = this.props.discussionData || {};
		const atomData = discussion.atomData || {};
		const versionData = discussion.versionData || {};
		const authorsData = discussion.authorsData || [];

		const date = versionData.createDate;

		return (
			<div style={styles.container} onClick={this.clickedTopic}>
				<div>{atomData.title.substring(0, 5) === 'Reply' ? ('Discussion by ' + authorsData[0].source.name) : atomData.title}</div>
				<div style={[styles.discussionFooter]}>
					<img style={styles.image} src={'https://jake.pubpub.org/unsafe/35x35/' + authorsData[0].source.image} />
					<span style={styles.discussionFooterItem}>{authorsData[0].source.name}</span>
					<span style={styles.discussionFooterItem}>{dateFormat(date, 'mmm dd, yyyy h:MM TT')}</span>
				</div>
			</div>
		);
	}
});

// const WrappedDiscussionItem = Radium(DiscussionItem);
export default DiscussionThreadHeader;

styles = {
	container: {
		padding: '1em 0em',
		borderBottom: '1px solid #CCC',
		cursor: 'pointer',
	},
	image: {
		width: '25px',
		verticalAlign: 'middle',
	},
	discussionFooter: {
		borderBottom: '1px solid #BBBDC0',
		marginBottom: '1em',
		paddingBottom: '1em',
	},
	discussionFooterItem: {
		padding: '0em 0em 0em 1em',
		fontSize: '0.75em',
		color: '#58585B',
	},

};
