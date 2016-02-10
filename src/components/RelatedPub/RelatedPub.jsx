import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const RelatedPub = React.createClass({
	propTypes: {
		relatedPubId: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			relatedPubId: 'none',
		};
	},

	render: function() {
		return (
			<div>
			<div style={styles.relatedTitle}>Read Next</div>
			<div style={styles.relatedBox}>
			<div style={styles.relatedText}>Hello, PubPub</div>
			<img src="https://d13yacurqjgara.cloudfront.net/users/106718/screenshots/504036/scientist.jpg" style={styles.relatedPic}/>
			<div style={styles.smallText}>An introduction to our grand experiment</div>
			</div>
			</div>
		);
	}
});

export default Radium(RelatedPub);

styles = {
	relatedTitle: {
		textAlign: 'center',
		marginBottom: '0.75em',
		userSelect: 'none',
	},
	relatedBox: {
		width: '75%%',
		textAlign: 'left',
		boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.137255) 0px 1px 1px 0px, rgba(0, 0, 0, 0.117647) 0px 2px 1px -1px',
		backgroundColor: 'white',
		padding: '6.25% 0%',
		cursor: 'pointer',
		userSelect: 'none',
	},
	relatedPic: {
		width: '100%',
		margin: '7px 0px',
	},
	relatedText: {
		fontSize: '0.8em',
		padding: '0px 6.25%',
	},
	smallText: {
		fontSize: '0.6em',
		width: '80%',
		padding: '0px 6.25%',
	},
};
