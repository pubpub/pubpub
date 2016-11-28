import React, { PropTypes } from 'react';

let styles;

export const PubDiscussionsNew = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
	},

	render: function() {
		
		return (
			<div style={styles.container}>
				<h2>New Discussion</h2>
			</div>
		);
	}
});

export default PubDiscussionsNew;

styles = {
	container: {
		
	},
};
