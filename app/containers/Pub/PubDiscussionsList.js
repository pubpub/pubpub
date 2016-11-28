import React, { PropTypes } from 'react';

let styles;

export const PubDiscussionsList = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
	},

	render: function() {
		
		return (
			<div style={styles.container}>
				<h3>Discussions</h3>
				<p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p>
				<p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p>
				<p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p>
				<p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p>
				<p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p>
				<p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p><p>Hello discussion 1</p>	
			</div>
		);
	}
});

export default PubDiscussionsList;

styles = {
	container: {
		
	},
};
