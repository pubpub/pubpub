import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';

let styles = {};

const PubMetaAnalytics = React.createClass({
	propTypes: {
		analyticsObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			analyticsObject: {},
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

export default Radium(PubMetaAnalytics);

styles = {
	container: {
		padding: 15,
	},
};
