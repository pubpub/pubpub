import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from 'utils/styleConstants';

let styles = {};

const PubMetaReviews = React.createClass({
	propTypes: {
		reviewsObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			reviewsObject: {},
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

					REVIEWSREVIEWSREVIEWSREVIEWS
					
			</div>
		);
	}
});

export default Radium(PubMetaReviews);

styles = {
	container: {
		padding: 15,
	},
};
