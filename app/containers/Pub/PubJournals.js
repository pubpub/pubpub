import React from 'react';

let styles;

export const PubJournals = React.createClass({

	render: function() {
		return (
			<div style={styles.container}>
				<div>Journals</div>
			</div>
		);
	}
});

export default PubJournals;

styles = {
	container: {
		padding: '1.5em',
	},
};
