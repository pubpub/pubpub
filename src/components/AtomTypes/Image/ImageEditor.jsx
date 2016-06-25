import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const ImageEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getSaveVersionContent: function() {
		return 'Saving from Image Editor';
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
