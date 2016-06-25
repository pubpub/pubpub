import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles = {};

export const AtomEditorHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
	},

	render: function() {

		return (
			<div className={'atom-editor-header'} style={styles.container}>
				
				<h1 style={styles.title}>{this.props.title}</h1>
				
			</div>
		);
	}
});

export default Radium(AtomEditorHeader);

styles = {
	container: {

	},
	title: {
		fontSize: '2em',
		margin: '.25em 0em',
	},
};
