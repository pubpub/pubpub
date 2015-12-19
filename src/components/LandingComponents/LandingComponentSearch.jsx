import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LandingComponentBlock = React.createClass({
	propTypes: {
		text: PropTypes.string,
		link: PropTypes.string,
		image: PropTypes.string,
	},

	render: function() {
		return (
			<div style={styles.container}>
				Search
			</div>
		);
	}
});

export default Radium(LandingComponentBlock);

styles = {

};
