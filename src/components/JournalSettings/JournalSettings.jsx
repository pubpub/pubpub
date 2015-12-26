import React, {PropTypes} from 'react';
import Radium from 'radium';
import {LoaderIndeterminate} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const JournalSettings = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		journalSaving: PropTypes.bool,
		journalSaveHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			journalData: {},
		};
	},

	saveSettings: function() {
		const newObject = {
			journalName: this.refs.name.value,
			customDomain: this.refs.customDomain.value,
		};
		
		this.props.journalSaveHandler(newObject);
	},

	render: function() {
		console.log(this.props.journalData);
		return (
			<div style={styles.container}>

				<div key={'settingsForm-name'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'name'}>Journal Name</label>
					<input style={styles.manualFormInput} name={'name'} id={'settingsForm-name'} ref={'name'} type="text" defaultValue={this.props.journalData.journalName}/>
				</div>

				<div key={'settingsForm-customDomain'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'customDomain'}>Custom Domain</label>
					<input style={styles.manualFormInput} name={'customDomain'} id={'settingsForm-customDomain'} ref={'customDomain'} type="text" defaultValue={this.props.journalData.customDomain}/>
				</div>

				<div style={styles.saveSettings} key={'userSettingsSaveButton'} onClick={this.saveSettings}>Save</div>

				<div style={styles.loader}>
					{this.props.journalSaving
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<div style={styles.settingsHeader}>Journal Admins</div>

			</div>
		);
	}
});

export default Radium(JournalSettings);

styles = {
	container: {
		margin: '10px 0px',
		fontFamily: 'Courier',
		position: 'relative',
	},
	settingsHeader: {
		fontFamily: globalStyles.headerFont,
		fontSize: '25px',
	},
	inputWrapper: {
		width: '400px',
		margin: '30px 20px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
		},
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
	loader: {
		position: 'relative',
		top: -50,
		width: '100%',
		height: 1
	},
};
