import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Radium from 'radium';
import Helmet from 'react-helmet';


import { Loader } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { submitResetRequest } from './actions';

let styles = {};

export const ResetPassword = React.createClass({
	propTypes: {
		resetPasswordData: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			email: '',
		};
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.resetPasswordData.loading;
		const nextLoading = nextProps.resetPasswordData.loading;
		const nextError = nextProps.resetPasswordData.error;

		if (oldLoading && !nextLoading && !nextError) {
			const redirectRoute = this.props.location.query && this.props.location.query.redirect;
			browserHistory.push(redirectRoute || '/');
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

	handleResetPasswordRequestSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(submitResetRequest(this.state.email));
	},

	render: function() {
		const resetPasswordData = this.props.resetPasswordData || {};
		const isLoading = resetPasswordData.loading;
		const error = resetPasswordData.error;

		return (
			<div style={styles.container}>
				<Helmet title={'Reset Password · PubPub'} />

				<h1><FormattedMessage {...globalMessages.ResetPassword} /></h1>

				<form onSubmit={this.handleResetPasswordRequestSubmit}>
					<div>
						<label style={styles.label} htmlFor={'email'}>
							<FormattedMessage {...globalMessages.Email} />
						</label>
						<input id={'email'} name={'email'} type="text" style={styles.input} value={this.state.email} onChange={this.inputUpdateLowerCase.bind(this, 'email')} />
					</div>

					<button name={'submitResetRequest'} className={'pt-button pt-intent-primary'} onClick={this.handleResetPasswordRequestSubmit}>
						<FormattedMessage {...globalMessages.ResetPassword} />
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!error} /></div>

					{error &&
						<div style={styles.errorMessage}>
							<FormattedMessage id="resetPassword.InvalidEmailOrPassword" defaultMessage="Invalid Email or Password" />
						</div>
					}
				</form>

			</div>
		);
	}

});


function mapStateToProps(state) {
	return {
		// resetPasswordData: state.resetPassword.toJS(),
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
