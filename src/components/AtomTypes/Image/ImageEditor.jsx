import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const ImageEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	render: function() {

		return (
			<div>
				
				My Image Editor
				
			</div>
		);
	}
});

export default Radium(ImageEditor);

styles = {

};
