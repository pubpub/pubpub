import React, {PropTypes} from 'react';
import Radium from 'radium';

import {Loader} from 'components';
import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const UserProfileSettingsAccount = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
		changePasswordHandler: PropTypes.func,
	},

	getInitialState() {
		return {
			validationError: undefined,
		};
	},

	validate: function(signUpData) {
		// Check to make sure password exists
		if (!signUpData.password || signUpData.password.length < 8) {
			return {isValid: false, validationError: "Old Password too short"};
		}
		if (!signUpData.newPassword || signUpData.password.length < 8) {
			return {isValid: false, validationError: "New Password too short"};
		}
		if (!signUpData.conPassword || signUpData.password.length < 8) {
			return {isValid: false, validationError: "Confirmation Password too short"};
		}
		if (signUpData.newPassword != signUpData.conPassword) {
			return {isValid: false, validationError: "Confirmation Password must match New Password"};
		}

		return {isValid: true, validationError: undefined};

	},

	changePass: function(evt) {
		evt.preventDefault();
		const changeData = {
			password: this.refs.password.value,
			newPassword: this.refs.newPassword.value,
			conPassword: this.refs.conPassword.value,
		};
		const {isValid, validationError} = this.validate(changeData);
		this.setState({validationError: validationError});
		if (isValid) {
			this.props.changePasswordHandler(changeData);	
		}
	},

	render: function() {
		const isLoading = this.props.settingsData && this.props.settingsData.get('loading');
		const errorMessage = this.props.settingsData && this.props.settingsData.get('error') || this.state.validationError;
		const successMessage = this.props.settingsData && this.props.settingsData.get('success');

		return (
			<div>

				<form onSubmit={this.handleChangePassSubmit} style={styles.form}>

					<div>
						<label htmlFor={'password'}>
							Old <FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'password'} id={'password'} name={'password'} type="password" style={styles.input}/>
					</div>

					<div>
						<label htmlFor={'newPassword'}>
							New <FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'newPassword'} id={'newPassword'} name={'newPassword'} type="password" style={styles.input}/>
					</div>
					<div className={'light-color inputSubtext'} to={'/resetpassword'}>
						<FormattedMessage id="signup.PasswordLength" defaultMessage="Must be at least 8 characters"/>
					</div>

					<div>
						<label htmlFor={'conPassword'}>
							Confirm <FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'conPassword'} id={'conPassword'} name={'conPassword'} type="password" style={styles.input}/>
					</div>

					<button className={'button'} onClick={this.changePass}>
						Change Password
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

					<div style={styles.successMessage}>{successMessage}</div>

				</form>
				
			</div>
		);
	}
});

export default Radium(UserProfileSettingsAccount);

styles = {
	form: {
		width: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		},
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	successMessage: {
		padding: '10px 0px',
		color: 'green',
	}
};