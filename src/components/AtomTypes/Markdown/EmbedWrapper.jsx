import React from 'react';

let styles;

export const EmbedWrapper = React.createClass({
	propTypes: {
		
	},

	render: function() {
		return (
			<div style={styles.container}>
				
			</div>
		);
	}
});

export default EmbedWrapper;

styles = {
	container: {
		width: '50px',
		height: '50px',
		backgroundColor: 'red',
	},
}
