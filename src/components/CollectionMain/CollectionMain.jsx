import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const CollectionMain = React.createClass({
	propTypes: {
		input: PropTypes.string,
	},

	getDefaultProps: function() {
		
	},

	render: function() {
		return (
			<div style={styles.container}>
				<div style={styles.header}>Main</div>
			</div>
		);
	}
});

export default Radium(CollectionMain);

styles = {
	header: {
		color: 'red',
	},
};
