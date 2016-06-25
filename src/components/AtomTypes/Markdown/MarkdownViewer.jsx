import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const MarkdownViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {

		return (
			<div>
				
				My Markdown Viewer
				
			</div>
		);
	}
});

export default Radium(MarkdownViewer);

styles = {

};
