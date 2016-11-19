import React, { PropTypes } from 'react';
import Radium from 'radium';

let styles;

export const PubJournals = React.createClass({
	propTypes: {
		journalsSubmitted: PropTypes.array,
		journalsFeatured: PropTypes.array,
	},

	render: function() {
		const journalsSubmitted = this.props.journalsSubmitted || [];
		const journalsFeatured = this.props.journalsFeatured || [];
		
		return (
			<div style={styles.container}>
				<h2>Journals</h2>

				<h3>Details and Metadata</h3>
				<h3>Other Journals</h3>
				
			</div>
		);
	}
});

export default Radium(PubJournals);

styles = {
	container: {
		padding: '1.5em',
	},
};
