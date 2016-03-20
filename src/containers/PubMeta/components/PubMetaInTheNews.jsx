import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';

let styles = {};

const PubMetaInTheNews = React.createClass({
	propTypes: {
		citationsObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			citationsObject: {},
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div style={globalStyles.emptyBlock}>Coming soon</div>
					
			</div>
		);
	}
});

export default Radium(PubMetaInTheNews);

styles = {
	container: {
		padding: 15,
	},
};
