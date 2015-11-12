import React from 'react';
import Radium from 'radium';

import {baseStyles} from './modalStyle';

const EditorModalCollaborators = React.createClass({
	render: function() {
		
		return (
			<div>
				<h2 style={baseStyles.topHeader}>Collaborators</h2>
			</div>
		);
	}
});

export default Radium(EditorModalCollaborators);
