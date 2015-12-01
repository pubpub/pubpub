import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';

// let styles = {};

const PubModalCite = React.createClass({
	propTypes: {
		string: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			// markdown: '',
		};
	},

	render: function() {
		return (
			<div style={baseStyles.pubModalContainer}>

				<div style={baseStyles.pubModalTitle}>Cite</div>

			</div>
		);
	}
});

export default Radium(PubModalCite);

// styles = {
	
// };
