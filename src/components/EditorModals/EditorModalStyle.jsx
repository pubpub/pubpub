import React, {PropTypes} from 'react';
import Radium from 'radium';

import {baseStyles} from './modalStyle';

const EditorModalStyle = React.createClass({

	render: function() {
		
		return (
			<div>
				<h2 style={baseStyles.topHeader}>Style</h2>
			</div>
		);
	}
});

export default Radium(EditorModalStyle);
