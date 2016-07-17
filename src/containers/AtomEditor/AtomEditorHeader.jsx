import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const AtomEditorHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		saveVersionHandler: PropTypes.func,
	},

	render: function() {

		return (
			<div className={'atom-editor-header'} style={styles.container}>
				
				<h1 style={styles.title}>{this.props.title}</h1>
				<div style={styles.buttonWrapper}>
					<div className={'button'} style={styles.button} onClick={this.props.saveVersionHandler}>Save Version</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(AtomEditorHeader);

styles = {
	container: {
		display: 'table',

	},
	title: {
		fontSize: '2em',
		padding: '.25em 1em .25em 0em',
		display: 'table-cell',
		verticalAlign: 'top',
	},
	buttonWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		paddingTop: '8px',
		width: '1%',
		whiteSpace: 'nowrap',
	},
	button: {
		fontSize: '.85em',
		padding: '.25em 1.5em',
	},
};
