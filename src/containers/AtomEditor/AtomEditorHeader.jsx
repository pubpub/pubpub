import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const AtomEditorHeader = React.createClass({
	propTypes: {
		title: PropTypes.string,
		saveVersionHandler: PropTypes.func,
		openDetails: PropTypes.func,
	},

	render: function() {

		return (
			<div className={'atom-editor-header'} style={styles.container}>
				
				<h1 style={styles.title}>
					<span onClick={this.props.openDetails} style={styles.titleText}>{this.props.title}</span> 
					<div className={'editor-participants'} style={styles.editorParticipants}></div>
				</h1>
				
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	title: {
		fontSize: '2em',
		padding: '.25em 1em .25em 0em',
		display: 'table-cell',
		verticalAlign: 'top',
		
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '.5em 0em',
		},
	},
	titleText: {
		cursor: 'pointer',
		paddingRight: '.5em',
	},
	editorParticipants: {
		display: 'inline-block',
	},
	buttonWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		paddingTop: '8px',
		width: '1%',
		whiteSpace: 'nowrap',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: 'auto',
			margin: '1em 0em',
		},
	},
	button: {
		fontSize: '.85em',
		padding: '.25em 1.5em',
	},
};
