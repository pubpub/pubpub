import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaReview = React.createClass({
	propTypes: {
		reviewObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			reviewObject: {},
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

					POST NEW REVIEW
					
			</div>
		);
	}
});

export default Radium(PubMetaReview);

styles = {
	container: {
		padding: 15,
	},
};
