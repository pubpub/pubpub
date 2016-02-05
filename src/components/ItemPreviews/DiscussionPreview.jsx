import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const DiscussionPreview = React.createClass({
	propTypes: {
		discussionData: PropTypes.object,
		displayType: PropTypes.string, // 'line' or 'block'
	},

	getDefaultProps: function() {
		return {
			displayType: 'line' 
		};
	},

	render: function() {
		const discussion = this.props.discussionData;
		if (!discussion || !discussion.pub) {return null;}
		return (
			<div style={styles.container} key={'discussionContainer-' + discussion._id}>
				<Link style={globalStyles.link} to={'/pub/' + discussion.pub.slug + '/discussions/' + discussion._id}>
					<div style={styles.pubLine}>
					<FormattedMessage
						id="preview.discussionOn"
						defaultMessage="Discussion on"/>
					{' '}{discussion.pub.title}</div>
					<div style={styles.scoreLine}><FormattedMessage {...globalMessages.score}/>: {discussion.points + 1}</div>
					<div style={styles.markdown}>{discussion.markdown}</div>
				</Link>
			</div>
		);
	}
});

export default Radium(DiscussionPreview);

styles = {
	container: {
		padding: '10px 5px',
		// margin: '10px',
		borderBottom: '1px solid #ccc',
		color: '#666',
		':hover': {
			color: 'black',
		}
	},
	pubLine: {
		color: '#999',
		fontSize: '13px',
	},
	scoreLine: {
		color: '#999',
		fontSize: '13px',
	},
	
};


