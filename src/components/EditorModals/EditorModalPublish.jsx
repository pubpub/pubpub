import React from 'react';
import Radium from 'radium';

import {baseStyles} from './modalStyle';

const EditorModalPublish = React.createClass({
	render: function() {
		
		return (
			<div>
				<h2 style={baseStyles.topHeader}>Publish</h2>
			</div>
		);
	}
});

export default Radium(EditorModalPublish);
