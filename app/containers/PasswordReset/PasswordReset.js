import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button, NonIdealState } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import Loading from 'components/Loading/Loading';
import { getPasswordReset, postPasswordReset, putPasswordReset } from 'actions/passwordReset';

require('./passwordReset.scss');

const propTypes = {
	passwordResetData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class PasswordReset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			validationError: undefined,
			showConfirmation: false,
		};
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.handlePostPasswordReset = this.handlePostPasswordReset.bind(this);
		this.handlePutPasswordReset = this.handlePutPasswordReset.bind(this);
	}
	componentWillMount() {
		const params = this.props.match.params;
		const slug = params.slug;
		const resetHash = params.resetHash;
		if (slug && resetHash) {
			this.props.dispatch(getPasswordReset(slug, resetHash));
		}
	}
	componentWillReceiveProps(nextProps) {
		const oldPostLoading = this.props.passwordResetData.postIsLoading;
		const nextPostLoading = nextProps.passwordResetData.postIsLoading;
		const nextPostError = nextProps.passwordResetData.postError;

		const oldPutLoading = this.props.passwordResetData.putIsLoading;
		const nextPutLoading = nextProps.passwordResetData.putIsLoading;
		const nextPutError = nextProps.passwordResetData.putError;

		if ((oldPostLoading && !nextPostLoading && !nextPostError)
			|| (oldPutLoading && !nextPutLoading && !nextPutError)
		) {
			this.setState({ showConfirmation: true });
		}
	}

	onEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}
	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}
	handlePostPasswordReset(evt) {
		evt.preventDefault();
		this.props.dispatch(postPasswordReset(this.state.email.toLowerCase()));
	}
	handlePutPasswordReset(evt) {
		evt.preventDefault();
		const params = this.props.match.params;
		const slug = params.slug;
		const resetHash = params.resetHash;
		const password = SHA3(this.state.password).toString(encHex);
		this.props.dispatch(putPasswordReset(password, slug, resetHash));
	}

	render() {
		const params = this.props.match.params;
		const resetHash = params.resetHash;
		const getIsLoading = this.props.passwordResetData.getIsLoading;
		const getError = this.props.passwordResetData.getError;
		const postIsLoading = this.props.passwordResetData.postIsLoading;
		const postError = this.props.passwordResetData.postError;
		const putIsLoading = this.props.passwordResetData.putIsLoading;
		const putError = this.props.passwordResetData.putError;
		return (
			<div className={'password-reset'}>
				<Helmet>
					<title>Password Reset</title>
				</Helmet>

				<div className={'container small'}>
					<div className={'row'}>
						<div className={'col-12'}>
							{!this.state.showConfirmation && !resetHash &&
								<h1>Reset Password</h1>
							}
							{!this.state.showConfirmation && !!resetHash &&
								<h1>Set Password</h1>
							}

							{/* Show form to submit email */}
							{!resetHash && !this.state.showConfirmation &&
								<form onSubmit={this.handlePostPasswordReset}>
									<p>Enter your email and a link to reset your password will be sent to you.</p>
									<InputField
										label={'Email'}
										type={'email'}
										placeholder={'example@email.com'}
										value={this.state.email}
										onChange={this.onEmailChange}
									/>
									<InputField error={postError && 'Error Resetting Password'}>
										<Button
											name={'create'}
											type={'submit'}
											className={'pt-button pt-intent-primary create-account-button'}
											onClick={this.handlePostPasswordReset}
											text={'Reset Password'}
											disabled={!this.state.email}
											loading={postIsLoading}
										/>
									</InputField>
								</form>
							}

							{/* Show password reset request confirmation, with directions to check email  */}
							{!resetHash && this.state.showConfirmation &&
								<NonIdealState
									description={'Check your inbox for an email with a reset link'}
									title={'Reset Password Email Sent'}
									visual={'envelope'}
								/>
							}

							{/* Show Loading screen to verify Hash */}
							{resetHash && getIsLoading &&
								<Loading width={'100%'} height={'40px'} margin={'4em 0em 1em'} />
							}

							{/* Show Error message if invalid hash */}
							{resetHash && !getIsLoading && getError &&
								<div className="pt-callout pt-intent-danger">
									Invalid hash. Try <Link to={'/resetpassword'}>resetting your password</Link> again.
								</div>
							}

							{/* Show form to submit new password */}
							{resetHash && !getIsLoading && !getError && !this.state.showConfirmation &&
								<form onSubmit={this.handlePutPasswordReset}>
									<InputField
										label={'Password'}
										type={'password'}
										value={this.state.password}
										onChange={this.onPasswordChange}
									/>
									<InputField error={putError && 'Error Resetting Password'}>
										<Button
											name={'create'}
											type={'submit'}
											className={'pt-button pt-intent-primary create-account-button'}
											onClick={this.handlePutPasswordReset}
											text={'Set New Password'}
											disabled={!this.state.password}
											loading={putIsLoading}
										/>
									</InputField>
								</form>
							}

							{/* Show confirmation of password reset. Link to Login */}
							{resetHash && !getIsLoading && !getError && this.state.showConfirmation &&
								<NonIdealState
									description={'Your password has been successfully changed.'}
									title={'Reset Password Successful'}
									visual={'tick'}
									action={
										<Link to={'/login'}>
											<button className={'pt-button pt-intent-primary pt-large'}>Login with new password</button>
										</Link>
									}
								/>
							}
						</div>
					</div>
				</div>
				
			</div>
		);
	}
}

PasswordReset.propTypes = propTypes;
export default withRouter(connect(state => ({
	passwordResetData: state.passwordReset,
}))(PasswordReset));
