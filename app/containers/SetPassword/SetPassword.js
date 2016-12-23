import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Radium from 'radium';
import Helmet from 'react-helmet';

import { browserHistory } from 'react-router';

import { Loader } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { submitPassword } from './actions';

let styles = {};

export const SetPassword = React.createClass({
	propTypes: {
		resetPasswordData: PropTypes.object,
		dispatch: PropTypes.func,
		params: PropTypes.object,
	},

	getInitialState() {
		return {
			resetHash: this.props.params.hash,
			username: this.props.params.username,
			password: '',
			validationError: undefined

		};
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.resetPasswordData.setPasswordLoading;
		const nextLoading = nextProps.resetPasswordData.setPasswordLoading;
		const nextError = nextProps.resetPasswordData.setPasswordError;

		if (oldLoading && !nextLoading && !nextError) {
			browserHistory.push('/login');
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

	handleSetPasswordSubmit: function(evt) {
		evt.preventDefault();
		const password = this.refs.password.value;

		const { isValid, validationError } = this.validate(password);

		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(submitPassword(this.state.password, this.state.username, this.state.resetHash));
		}
	},

	validate: function(password) {

		if (password.length <= 7) return { isValid: false, validationError: <FormattedMessage id="setPassword.Passwordtooshort" defaultMessage="Password too short" /> };
		return { isValid: true, validationError: undefined };

	},

	render: function() {
		const resetPasswordData = this.props.resetPasswordData || {};
		const isLoading = resetPasswordData.setPasswordLoading;
		const error = resetPasswordData.setPasswordError || this.state.validationError;
		const validationError = this.state.validationError || undefined;

		return (
			<div style={styles.container}>
				<Helmet title={'Set Password · PubPub'} />

				<h1><FormattedMessage {...globalMessages.SetPassword} /></h1>

					<form onSubmit={this.handleSetPasswordSubmit}>
						<label htmlFor={'password'}>
							<FormattedMessage {...globalMessages.Password} />
							<input ref={'password'} id={'password'} name={'password'} type="password" style={styles.input} value={this.state.password} onChange={this.inputUpdate.bind(this, 'password')} />
							<div className={'light-color inputSubtext'} to={'/setpassword'}>
								<FormattedMessage {...globalMessages.PasswordLength} />
							</div>
						</label>


						<button name={'submitSetRequest'} className={'pt-button pt-intent-primary'} onClick={this.handleSetPasswordSubmit}>
							<FormattedMessage {...globalMessages.ResetPassword} />
						</button>

						<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!error} /></div>
						</form>


					{ error && !validationError &&
						<div style={styles.errorMessage}>
							<FormattedMessage id="setPassword.InvalidHash" defaultMessage="Invalid Hash" />
						</div>
					}
					{ error && validationError &&
						<div style={styles.errorMessage}>
							{this.state.validationError}
						</div>
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

export default connect(mapStateToProps)(Radium(SetPassword));

styles = {
	container: {
		width: '500px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
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
	registerLink: {
		display: 'block',
		margin: '1em 0em',
	},

};
