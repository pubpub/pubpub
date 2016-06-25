import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const MarkdownEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getSaveVersionData: function() {
		return 'Saving from Markdown Editor';
	},

	render: function() {

		return (
			<div>
				
				My Markdown Editor
				
			</div>
		);
	}
});

export default Radium(MarkdownEditor);

styles = {

};
