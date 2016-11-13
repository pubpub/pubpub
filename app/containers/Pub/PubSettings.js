import React from 'react';

let styles;

export const PubSettings = React.createClass({

	render: function() {
		return (
			<div style={styles.container}>
				<h2>Settings</h2>

				<h3>Details and Metadata</h3>
				<h3>Other Settings</h3>
				
			</div>
		);
	}
});

export default PubSettings;

styles = {
	container: {
		padding: '1.5em',
	},
};
