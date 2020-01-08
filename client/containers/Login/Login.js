import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { usePageContext } from 'utils/hooks';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { AnchorButton, Button, NonIdealState } from '@blueprintjs/core';
import { Avatar, GridWrapper, InputField } from 'components';
import { apiFetch } from 'utils';

require('./login.scss');

const Login = () => {
	const [loginLoading, setLoginLoading] = useState(false);
	const [loginError, setLoginError] = useState(undefined);
	const [logoutLoading, setLogoutLoading] = useState(false);

	const onLoginSubmit = (evt) => {
		// evt.preventDefault();
		// if (
		// 	!this.emailRef.current ||
		// 	!this.emailRef.current.value ||
		// 	!this.passwordRef.current ||
		// 	!this.passwordRef.current.value
		// ) {
		// 	return this.setState({ loginLoading: false, loginError: 'Invalid Email or Password' });
		// }
		// this.setState({ loginLoading: true, loginError: undefined });
		// return apiFetch('/api/login', {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		email: this.emailRef.current.value.toLowerCase(),
		// 		password: SHA3(this.passwordRef.current.value).toString(encHex),
		// 	}),
		// })
		// 	.then(() => {
		// 		window.location.href = this.props.locationData.query.redirect || '/';
		// 	})
		// 	.catch(() => {
		// 		this.setState({ loginLoading: false, loginError: 'Invalid Email or Password' });
		// 	});
	};
	const onLogoutSubmit = () => {
		// this.setState({ logoutLoading: true });
		// apiFetch('/api/logout').then(() => {
		// 	window.location.href = '/';
		// });
	};

	const { locationData, loginData, communityData } = usePageContext();
	return (
		<div id="login-container">
			{/* <PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					scopeData={this.props.scopeData}
					hideNav={true}
					hideFooter={true}
				> */}
			<GridWrapper containerClassName="small" columnClassName="bp3-elevation">
				{!loginData.id && (
					<div>
						<h1>Login</h1>
						{!locationData.isBasePubPub && (
							<p>
								Login to <b>{communityData.title}</b> using your{' '}
								<a href="https://www.pubpub.org">PubPub</a> account.
							</p>
						)}
						<form onSubmit={onLoginSubmit}>
							<InputField
								label="Email"
								placeholder="example@email.com"
								autocomplete="username"
								// inputRef={emailRef}
							/>
							<InputField
								label="Password"
								type="password"
								autocomplete="current-password"
								helperText={<a href="/password-reset">Forgot Password</a>}
								// inputRef={passwordRef}
							/>
							<InputField error={loginError}>
								<Button
									name="login"
									type="submit"
									className="bp3-button bp3-intent-primary"
									onClick={onLoginSubmit}
									text="Login"
									loading={loginLoading}
								/>
							</InputField>
						</form>

						<a href="/signup" className="switch-message">
							Don&apos;t have a PubPub account? Click to Signup
						</a>
					</div>
				)}
				{loginData.id && (
					<NonIdealState
						visual={
							<Avatar
								initials={loginData.initials}
								avatar={loginData.avatar}
								width={100}
							/>
						}
						title="Already Logged In"
						action={
							<div>
								<AnchorButton
									className="bp3-large action-button"
									text="View Profile"
									href={`/user/${loginData.slug}`}
								/>
								<Button
									className="bp3-large action-button"
									text="Logout"
									onClick={onLogoutSubmit}
									loading={logoutLoading}
								/>
							</div>
						}
					/>
				)}
			</GridWrapper>
			{/* </PageWrapper> */}
		</div>
	);
};

// Login.propTypes = propTypes;
export default Login;

// hydrateWrapper(Login);
