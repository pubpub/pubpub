import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaExperts = React.createClass({
	propTypes: {
		expertObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			expertObject: [],
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

					EXPERTSEXPERTSEXPERTS
					
			</div>
		);
	}
});

export default Radium(PubMetaExperts);

styles = {
	container: {
		padding: 15,
	},
};
