import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Loader } from 'components';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import { NonIdealState, Spinner } from '@blueprintjs/core';

import { postResetRequest, checkResetHash, postPassword } from './actions';

let styles = {};

export const ResetPassword = React.createClass({
	propTypes: {
		resetPasswordData: PropTypes.object,
		params: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			email: '',
			password: '',
			validationError: undefined,
			showConfirmation: false,
		};
	},

	componentWillMount() {
		const params = this.props.params || {};
		const username = params.username;
		const resetHash = params.resetHash;
		if (username && resetHash) {
			this.props.dispatch(checkResetHash(username, resetHash));	
		}
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.resetPasswordData.loading;
		const nextLoading = nextProps.resetPasswordData.loading;
		const nextError = nextProps.resetPasswordData.error;

		if (oldLoading && !nextLoading && !nextError) {
			this.setState({ showConfirmation: true });
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase() });
	},

	validate: function(password) {
		if (password.length <= 7) return { isValid: false, validationError: <FormattedMessage id="setPassword.Passwordtooshort" defaultMessage="Password too short" /> };
		return { isValid: true, validationError: undefined };
	},

	handleResetPasswordSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(postResetRequest(this.state.email));
	},

	handleSetPasswordSubmit: function(evt) {
		evt.preventDefault();
		const params = this.props.params || {};
		const username = params.username;
		const resetHash = params.resetHash;
		const password = this.state.password;
		const { isValid, validationError } = this.validate(password);
		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(postPassword(this.state.password, username, resetHash));
		}
	},

	render: function() {
		const resetPasswordData = this.props.resetPasswordData || {};
		const params = this.props.params || {};
		const resetHash = params.resetHash;

		const isLoading = resetPasswordData.loading;
		const error = this.state.validationError || resetPasswordData.error;
		const hashLoading = resetPasswordData.checkResetHashLoading;
		const hashError = resetPasswordData.checkResetHashError;

		return (
			<div style={styles.container}>
				<Helmet title={'Reset Password · PubPub'} />

				{!resetHash &&
					<h1 style={styles.header}><FormattedMessage {...globalMessages.ResetPassword} /></h1>
				}
				{!!resetHash &&
					<h1 style={styles.header}><FormattedMessage {...globalMessages.SetPassword} /></h1>
				}
				
				{/* Show form to submit email */}
				{!resetHash && !this.state.showConfirmation &&
					<form onSubmit={this.handleResetPasswordSubmit}>
						<p>Enter your email and a link to reset your password will be sent to you.</p>

						<label style={styles.label} htmlFor={'email'}>
							<FormattedMessage {...globalMessages.Email} />
							<input id={'email'} className={'pt-input margin-bottom'} name={'email'} type="text" style={styles.input} value={this.state.email} onChange={this.inputUpdateLowerCase.bind(this, 'email')} />
						</label>
						
						<button name={'submitResetRequest'} className={'pt-button pt-intent-primary'} onClick={this.handleResetPasswordSubmit}>
							<FormattedMessage {...globalMessages.ResetPassword} />
						</button>

						<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!error} /></div>
						{ error &&
							<div style={styles.errorMessage}>
								<FormattedMessage id="resetPassword.InvalidEmail" defaultMessage="Invalid Email" />
							</div>
						}
					</form>
				}

				{/* Show password reset request confirmation, with directions to check email  */}
				{!resetHash && this.state.showConfirmation &&
					<NonIdealState
						description={<span><FormattedMessage id="resetPassword.CheckInbox" defaultMessage="Check your inbox for an email with a reset link" /></span>}
						title={<span><FormattedMessage id="resetPassword.EmailSent" defaultMessage="Reset Password Email Sent" /></span>}
						visual={'envelope'} />
				}

				{/* Show Loading screen to verify Hash */}
				{resetHash && hashLoading &&
					<Spinner />
				}

				{/* Show Error message if invalid hash */}
				{resetHash && !hashLoading && hashError &&
					<div className="pt-callout pt-intent-danger">
						Invalid hash. Try <Link to={'/resetpassword'}>resetting your password</Link> again.
					</div>
				}

				{/* Show form to submit new password */}
				{resetHash && !hashLoading && !hashError && !this.state.showConfirmation &&
					<form onSubmit={this.handleSetPasswordSubmit}>
						<label htmlFor={'password'}>
							<FormattedMessage {...globalMessages.Password} />
							<input id={'password'} name={'password'} type="password" style={styles.input} value={this.state.password} onChange={this.inputUpdate.bind(this, 'password')} />
							<div className={'light-color inputSubtext'} to={'/setpassword'}>
								<FormattedMessage {...globalMessages.PasswordLength} />
							</div>
						</label>


						<button name={'submitSetRequest'} className={'pt-button pt-intent-primary'} onClick={this.handleSetPasswordSubmit}>
							Set New Password
						</button>

						<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!error} /></div>
						{ error &&
							<div style={styles.errorMessage}>{error}</div>
						}
					</form>
				}

				{/* Show confirmation of password reset. Link to Login */}
				{resetHash && !hashLoading && !hashError && this.state.showConfirmation &&
					<NonIdealState
						description={<span><FormattedMessage id="setPassword.SuccessDescription" defaultMessage="Your password has been successfully changed." /></span>}
						title={'Reset Password Successful'}
						visual={'tick'}
						action={
							<Link to={'/login'}>
								<button className={'pt-button pt-intent-primary pt-large'}>Login with new password</button>
							</Link>}
					/>
				}

			</div>
		);
	}

});


function mapStateToProps(state) {
	return {
		resetPasswordData: state.resetPassword.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(ResetPassword));

styles = {
	container: {
		width: '500px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	header: {
		marginBottom: '1em',
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
		margin: '1em 0px',
		color: globalStyles.errorRed,
	},

};
