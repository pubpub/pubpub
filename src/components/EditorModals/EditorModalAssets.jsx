import React, {PropTypes} from 'react';
import Radium from 'radium';

import {baseStyles} from './modalStyle';

const EditorModalAssets = React.createClass({
	propTypes: {
		activeModal: PropTypes.string,
		assetData: PropTypes.array
	},

	render: function() {
		
		return (
			<div>
				<h2 style={baseStyles.topHeader}>Assets</h2>
				{JSON.stringify(this.props.assetData)}
			</div>
		);
	}
});

export default Radium(EditorModalAssets);
