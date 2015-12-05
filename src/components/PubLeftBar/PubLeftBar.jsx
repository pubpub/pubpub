import React, {PropTypes} from 'react';
import Radium from 'radium';
// import Markdown from 'react-remarkable';
// import {globalStyles} from '../../utils/styleConstants';
// import {rightBarStyles} from '../../containers/Reader/rightBarStyles';
// import {PubDiscussion} from '../../components';
// import dateFormat from 'dateformat';

let styles = {};

const PubLeftBar = React.createClass({
	propTypes: {
		slug: PropTypes.string,
	},

	render: function() {
		return (
			<div style={styles.container}>
				
				<div style={styles.detail}>Home</div>
				<div style={styles.detail}>Random Pub</div>
				<div style={styles.detail}>Explore PubPub</div>

				<div style={styles.leftBarDivider}></div>

				<div style={styles.detail}>History</div>
				<div style={styles.detail}>Source</div>
				<div style={styles.detail}>Analytics</div>
				<div style={styles.detail}>Citations</div>
				<div style={styles.detail}>In the News</div>
				<div style={styles.detail}>Share</div>					

				
			</div>
		);
	}
});

export default Radium(PubLeftBar);

styles = {
	container: {

	},
	detail: {
		fontSize: '13px',
		padding: '8px 0px',
	},
	leftBarDivider: {
		backgroundColor: '#DDD',
		width: '100%',
		height: 1,
		margin: '15px auto',
	},
};
