import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import Helmet from 'react-helmet';
// import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button, NonIdealState } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, apiFetch } from 'utilities';
// import Loading from 'components/Loading/Loading';
// import { getPasswordReset, postPasswordReset, putPasswordReset } from 'actions/passwordReset';

require('./passwordReset.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	passwordResetData: PropTypes.object.isRequired,
	// match: PropTypes.object.isRequired,
	// dispatch: PropTypes.func.isRequired,
};

class PasswordReset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			// validationError: undefined,
			showConfirmation: false,
		};
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.handlePostPasswordReset = this.handlePostPasswordReset.bind(this);
		this.handlePutPasswordReset = this.handlePutPasswordReset.bind(this);
	}
	// componentWillMount() {
	// 	const params = this.props.match.params;
	// 	const slug = params.slug;
	// 	const resetHash = params.resetHash;
	// 	if (slug && resetHash) {
	// 		this.props.dispatch(getPasswordReset(slug, resetHash));
	// 	}
	// }
	// componentWillReceiveProps(nextProps) {
	// 	const oldPostLoading = this.props.passwordResetData.postIsLoading;
	// 	const nextPostLoading = nextProps.passwordResetData.postIsLoading;
	// 	const nextPostError = nextProps.passwordResetData.postError;

	// 	const oldPutLoading = this.props.passwordResetData.putIsLoading;
	// 	const nextPutLoading = nextProps.passwordResetData.putIsLoading;
	// 	const nextPutError = nextProps.passwordResetData.putError;

	// 	if ((oldPostLoading && !nextPostLoading && !nextPostError)
	// 		|| (oldPutLoading && !nextPutLoading && !nextPutError)
	// 	) {
	// 		this.setState({ showConfirmation: true });
	// 	}
	// }

	onEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}
	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}
	handlePostPasswordReset(evt) {
		evt.preventDefault();

		this.setState({ postIsLoading: true });
		return apiFetch('/password-reset', {
			method: 'POST',
			body: JSON.stringify({
				email: this.state.email.toLowerCase(),
			})
		})
		.then(()=> {
			this.setState({ postIsLoading: false, showConfirmation: true });
		})
		.catch(()=> {
			this.setState({ postIsLoading: false, postError: 'Error' });
		});
	}
	handlePutPasswordReset(evt) {
		evt.preventDefault();

		this.setState({ putIsLoading: true });
		return apiFetch('/password-reset', {
			method: 'PUT',
			body: JSON.stringify({
				password: SHA3(this.state.password).toString(encHex),
				slug: this.props.locationData.params.slug,
				resetHash: this.props.locationData.params.resetHash,
			})
		})
		.then(()=> {
			this.setState({ putIsLoading: false, showConfirmation: true });
		})
		.catch(()=> {
			this.setState({ putIsLoading: false, putError: 'Error' });
		});
	}

	render() {
		const resetHash = this.props.locationData.params.resetHash;
		// const getIsLoading = this.props.passwordResetData.getIsLoading;
		// const getError = this.props.passwordResetData.getError;
		// const postIsLoading = this.props.passwordResetData.postIsLoading;
		// const postError = this.props.passwordResetData.postError;
		// const putIsLoading = this.props.passwordResetData.putIsLoading;
		// const putError = this.props.passwordResetData.putError;
		return (
			<div id="password-reset-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					{/*<Helmet>
						<title>Password Reset</title>
					</Helmet>*/}

					<div className="container small">
						<div className="row">
							<div className="col-12">
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
											label="Email"
											type="email"
											placeholder="example@email.com"
											value={this.state.email}
											onChange={this.onEmailChange}
										/>
										<InputField error={this.state.postError && 'Error Resetting Password'}>
											<Button
												name="create"
												type="submit"
												className="pt-button pt-intent-primary create-account-button"
												onClick={this.handlePostPasswordReset}
												text="Reset Password"
												disabled={!this.state.email}
												loading={this.state.postIsLoading}
											/>
										</InputField>
									</form>
								}

								{/* Show password reset request confirmation, with directions to check email  */}
								{!resetHash && this.state.showConfirmation &&
									<NonIdealState
										description="Check your inbox for an email with a reset link"
										title="Reset Password Email Sent"
										visual="envelope"
									/>
								}

								{/* Show Loading screen to verify Hash */}
								{/*resetHash && getIsLoading &&
									<Loading width="100%" height="40px" margin="4em 0em 1em" />
								*/}

								{/* Show Error message if invalid hash */}
								{resetHash && !this.props.passwordResetData.hashIsValid &&
									<div className="pt-callout pt-intent-danger">
										Invalid hash. Try <a href="/password-reset">resetting your password</a> again.
									</div>
								}

								{/* Show form to submit new password */}
								{resetHash && this.props.passwordResetData.hashIsValid && !this.state.showConfirmation &&
									<form onSubmit={this.handlePutPasswordReset}>
										<InputField
											label="Password"
											type="password"
											value={this.state.password}
											onChange={this.onPasswordChange}
										/>
										<InputField error={this.state.putError && 'Error Resetting Password'}>
											<Button
												name="create"
												type="submit"
												className="pt-button pt-intent-primary create-account-button"
												onClick={this.handlePutPasswordReset}
												text="Set New Password"
												disabled={!this.state.password}
												loading={this.state.putIsLoading}
											/>
										</InputField>
									</form>
								}

								{/* Show confirmation of password reset. Link to Login */}
								{resetHash && this.props.passwordResetData.hashIsValid && this.state.showConfirmation &&
									<NonIdealState
										description="Your password has been successfully changed."
										title="Reset Password Successful"
										visual="tick"
										action={
											<a href="/login">
												<button className="pt-button pt-intent-primary pt-large">Login with new password</button>
											</a>
										}
									/>
								}
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

PasswordReset.propTypes = propTypes;
export default PasswordReset;

hydrateWrapper(PasswordReset);
