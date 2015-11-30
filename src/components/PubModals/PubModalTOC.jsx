// import React, { PropTypes } from 'react';
import React from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';

// let styles = {};

const PubModalTOC = React.createClass({
	// propTypes: {
		
	// },

	render: function() {
		
		return (
			<div>
				<div style={baseStyles.pubModalTitle}>Table of Contents</div>
			</div>
		);
	}
});

export default Radium(PubModalTOC);

// styles = {
	
// };
