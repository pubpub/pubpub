import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

export const AtomEditorHeader = React.createClass({
	propTypes: {
		title: PropTypes.array,
	},

	render: function() {

		return (
			<div className={'atom-editor-header'}>
				
				<h1>{this.props.title}</h1>
				
			</div>
		);
	}
});

export default Radium(AtomEditorHeader);
