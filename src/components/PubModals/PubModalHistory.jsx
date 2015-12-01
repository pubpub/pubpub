import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';

// let styles = {};

const PubModalHistory = React.createClass({
	propTypes: {
		historyData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			// markdown: '',
		};
	},

	render: function() {
		return (
			<div style={baseStyles.pubModalContainer}>

				<div style={baseStyles.pubModalTitle}>History</div>

			</div>
		);
	}
});

export default Radium(PubModalHistory);

// styles = {
	
// };
