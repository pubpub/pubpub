import React, { PropTypes } from 'react';
import Radium from 'radium';

let styles;

export const PubSettings = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
	},

	render: function() {
		const pubData = this.props.pubData || {};
		return (
			<div style={styles.container}>
				<h2>Settings</h2>

				<h3>Details and Metadata</h3>
				<h3>Other Settings</h3>
				
			</div>
		);
	}
});

export default Radium(PubSettings);

styles = {
	container: {
		padding: '1.5em',
	},
};
