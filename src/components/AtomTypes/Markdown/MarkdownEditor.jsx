import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const MarkdownEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
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
