import React, { PropTypes } from 'react';

let styles;

export const PubReviewers = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
	},

	render: function() {
		
		return (
			<div style={styles.container}>
				<h2>Reviewers</h2>
			</div>
		);
	}
});

export default PubReviewers;

styles = {
	container: {
		
	},
};
