import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const ImageViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {

		return (
			<div>
				
				My Image Viewer
				
			</div>
		);
	}
});

export default Radium(ImageViewer);

styles = {

};
