import React, {PropTypes} from 'react';
import Radium from 'radium';
import {LoaderIndeterminate} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const UserSettings = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		saveStatus: PropTypes.string,
		handleSettingsSave: PropTypes.func,
	},

	getDefaultProps: function() {
		
	},

	saveSettings: function() {
		const newDetails = {
			name: this.refs.name.value,
			title: this.refs.title.value,
			bio: this.refs.bio.value,
		};
		this.props.handleSettingsSave(newDetails);
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div key={'settingsForm-name'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'name'}>Name</label>
					<input style={styles.manualFormInput} name={'name'} id={'settingsForm-name'} ref={'name'} type="text" defaultValue={this.props.profileData.name}/>
				</div>

				<div key={'settingsForm-title'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'title'}>Title</label>
					<input style={styles.manualFormInput} name={'title'} id={'settingsForm-title'} ref={'title'} type="text" defaultValue={this.props.profileData.title}/>
				</div>

				<div key={'settingsForm-bio'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'bio'}>Bio</label>
					<textarea style={[styles.manualFormInput, styles.manualFormTextArea]} name={'bio'} id={'settingsForm-bio'} ref={'bio'} defaultValue={this.props.profileData.bio}></textarea>
				</div>

				<div style={styles.saveSettings} key={'userSettingsSaveButton'} onClick={this.saveSettings}>Save</div>

				<div style={styles.loader}>
					{this.props.saveStatus === 'saving'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

			</div>
		);
	}
});

export default Radium(UserSettings);

styles = {
	container: {
		margin: '10px 0px',
		fontFamily: 'Courier',
		position: 'relative',
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
		position: 'absolute',
		bottom: 35,
		width: '100%',
	},
};
