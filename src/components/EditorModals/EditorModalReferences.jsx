import React, {PropTypes} from 'react';
import Radium from 'radium';

import {baseStyles} from './modalStyle';

const EditorModalReferences = React.createClass({
	propTypes: {
	},

	render: function() {
		
		return (
			<div>
				<h2 style={baseStyles.topHeader}>References</h2>
			</div>
		);
	}
});

export default Radium(EditorModalReferences);
