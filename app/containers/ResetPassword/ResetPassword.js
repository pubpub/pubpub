import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import Radium from 'radium';
import Helmet from 'react-helmet';


import { Loader } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { submitResetRequest } from './actions';

import { NonIdealState } from '@blueprintjs/core';


let styles = {};

export const ResetPassword = React.createClass({
	propTypes: {
		accoundData: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			email: '',
			showConfirmation: false
		};
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.accountData.resetPasswordLoading;
		const nextLoading = nextProps.accountData.resetPasswordLoading;
		const nextError = nextProps.accountData.resetPasswordError;

		if (oldLoading && !nextLoading && !nextError) {
			this.setState({ showConfirmation: true })
			// browserHistory.push(redirectRoute || '/');
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
		const accountData = this.props.accountData || {};
		const isLoading = accountData.loading;
		const error = accountData.resetPasswordError;

		const showConfirmation = this.state.showConfirmation;


		return (
			<div style={styles.container}>
				<Helmet title={'Reset Password · PubPub'} />

				{!(showConfirmation && !error) &&
					<h1><FormattedMessage {...globalMessages.ResetPassword} /></h1>
				}

				{ error &&
					<div style={styles.errorMessage}>
						<FormattedMessage id="resetPassword.InvalidEmail" defaultMessage="Invalid Email" />
					</div>
				}

				{!showConfirmation &&
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
						</form>

					}



						{ showConfirmation &&
								<NonIdealState
									description={'Check your inbox for a reset password email'}
									title={'Reset Password Email Sent'}
									visual={'envelope'} />
						}

			</div>
		);
	}

});


function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
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
