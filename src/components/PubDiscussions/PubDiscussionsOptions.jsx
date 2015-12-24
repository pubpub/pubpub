import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';

let styles = {};

const PubDiscussionsOptions = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		toggleHighlightsHandler: PropTypes.func,
		showPubHighlights: PropTypes.bool,
	},

	render: function() {
		return (
			<div>
				<Link to={'/pub/' + this.props.slug + '/invite'} style={globalStyles.link}><span key={'discussionButton2'} style={rightBarStyles.sectionSubHeaderSpan}>Invite Reviewers</span></Link>
				<span style={styles.optionSeparator}>|</span>
				<span style={styles.option} key={'discussions-highlight-toggle'} onClick={this.props.toggleHighlightsHandler}>Turn Highlights {this.props.showPubHighlights ? 'Off' : 'On'}</span>
			</div>
			
		);
	}
});

export default Radium(PubDiscussionsOptions);

styles = {
	container: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0px 10px',
		},
	},
	option: {
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: '#000',
		}
	},
	optionSeparator: {
		padding: '0px 6px',
	},
};
