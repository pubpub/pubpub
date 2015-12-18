import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const JournalDesign = React.createClass({
	propTypes: {
		input: PropTypes.string,
	},

	getDefaultProps: function() {
		
	},

	render: function() {
		return (
			<div style={styles.container}>
				<div style={styles.header}>Design</div>
			</div>
		);
	}
});

export default Radium(JournalDesign);

styles = {
	header: {
		color: 'red',
	},
};
