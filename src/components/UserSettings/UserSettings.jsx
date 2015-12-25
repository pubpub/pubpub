import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const UserSettings = React.createClass({
	propTypes: {
		input: PropTypes.string,
	},

	getDefaultProps: function() {
		
	},

	saveSettings: function() {
		// Grab all the form content by their refs
		// Stick it in an object, call the this.props.handleSettingsSave
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div key={'settingsForm-name'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'name'}>Name</label>
					<input style={styles.manualFormInput} name={'name'} id={'settingsForm-name'} ref={'settingsForm-name'} type="text" defaultValue={'Jingle'}/>
				</div>

				<div key={'settingsForm-title'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'title'}>Title</label>
					<input style={styles.manualFormInput} name={'title'} id={'settingsForm-title'} ref={'settingsForm-title'} type="text" defaultValue={'Doctor of things'}/>
				</div>

				<div key={'settingsForm-bio'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'bio'}>Bio</label>
					<textarea style={[styles.manualFormInput, styles.manualFormTextArea]} name={'bio'} id={'settingsForm-bio'} ref={'settingsForm-bio'} defaultValue={'Jingle'}></textarea>
				</div>

				<div style={styles.saveSettings} key={'userSettingsSaveButton'} onClick={this.saveSettings}>Save</div>

			</div>
		);
	}
});

export default Radium(UserSettings);

styles = {
	container: {
		margin: '10px 0px',
		fontFamily: 'Courier',
	},
	inputWrapper: {
		width: '400px',
		margin: '30px 20px',
	},
	manualFormInputTitle: {
		fontSize: 20,
		color: '#BBB',
	},
	manualFormInput: {
		width: '100%',
		fontFamily: 'Courier',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#BBB',
		outline: 'none',
		fontSize: 18,
		color: '#555',
	},
	manualFormTextArea: {
		borderWidth: '1px 1px 1px 1px',
		resize: 'vertical',
	},
	saveSettings: {
		fontSize: 20,
		width: '52px',
		padding: '0px 20px',
		marginBottom: 20,
		fontFamily: globalStyles.headerFont,
		cursor: 'pointer',
		':hover': {
			color: 'black',
		}
	},
};
