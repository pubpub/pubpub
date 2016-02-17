import React, {PropTypes} from 'react';
import Radium from 'radium';
import {LoaderIndeterminate} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserSettings = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
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
			sendNotificationDigest: this.refs.sendNotificationDigest.checked,
		};
		this.props.handleSettingsSave(newDetails);
	},

	render: function() {
		return (
			<div style={styles.container}>
				{this.props.ownProfile === 'self'
					? <div>
						<div key={'settingsForm-name'} style={styles.inputWrapper}>
							<label style={styles.manualFormInputTitle} htmlFor={'settingsForm-name'}>
								<FormattedMessage id="user.name" defaultMessage="Name"/>
							</label>
							<input style={styles.manualFormInput} name={'name'} id={'settingsForm-name'} ref={'name'} type="text" defaultValue={this.props.profileData.name}/>
						</div>

						<div key={'settingsForm-title'} style={styles.inputWrapper}>
							<label style={styles.manualFormInputTitle} htmlFor={'settingsForm-title'}>
								<FormattedMessage id="user.titleForPerson" defaultMessage="Title"/>
							</label>
							<input style={styles.manualFormInput} name={'title'} id={'settingsForm-title'} ref={'title'} type="text" defaultValue={this.props.profileData.title}/>
						</div>

						<div key={'settingsForm-bio'} style={styles.inputWrapper}>
							<label style={styles.manualFormInputTitle} htmlFor={'settingsForm-bio'}>
								<FormattedMessage id="user.userBio" defaultMessage="Bio"/>
							</label>
							<textarea style={[styles.manualFormInput, styles.manualFormTextArea]} name={'bio'} id={'settingsForm-bio'} ref={'bio'} defaultValue={this.props.profileData.bio}></textarea>
						</div>

						<div key={'settingsForm-sendNotificationDigest'} style={[styles.inputWrapper, styles.checkboxWrapper]}>
							<label style={[styles.manualFormInputTitle, styles.checkboxLabel]} htmlFor={'sendNotificationDigest'}>
								<FormattedMessage id="journal.sendNotificationDigest" defaultMessage="Send Notification Digest"/>
							</label>
							<input style={[styles.manualFormInput, styles.checkboxInput]} name={'sendNotificationDigest'} id={'settingsForm-sendNotificationDigest'} ref={'sendNotificationDigest'} type="checkbox" onChange={()=>{return this.setState({});}} defaultChecked={this.props.profileData.sendNotificationDigest === undefined ? true : this.props.profileData.sendNotificationDigest}/>
							{(this.refs.sendNotificationDigest && this.refs.sendNotificationDigest.checked) || (!this.refs.sendNotificationDigest && this.props.profileData.sendNotificationDigest) || (!this.refs.sendNotificationDigest && this.props.profileData.sendNotificationDigest === undefined)
								? <label htmlFor={'settingsForm-sendNotificationDigest'}> enabled</label>
								: <label htmlFor={'settingsForm-sendNotificationDigest'}> disabled</label>
							}
						</div>

						<div style={styles.saveSettings} key={'userSettingsSaveButton'} onClick={this.saveSettings}>
							<FormattedMessage {...globalMessages.save} />
						</div>

						<div style={styles.loader}>
							{this.props.saveStatus === 'saving'
								? <LoaderIndeterminate color={globalStyles.sideText}/>
								: null
							}
						</div>
					</div>
					: <div style={globalStyles.emptyBlock}>
						<FormattedMessage id="user.notLoggedIn" defaultMessage="Not authorized to edit settings"/>
					</div>
				}
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
	checkboxWrapper: {
		width: '600px',
	},
	checkboxLabel: {
		display: 'block',
	},
	checkboxInput: {
		width: 'auto',
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
