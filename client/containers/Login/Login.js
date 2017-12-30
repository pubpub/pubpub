import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import queryString from 'query-string';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { apiFetch, hydrateWrapper } from 'utilities';

require('./login.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	isBasePubPub: PropTypes.bool.isRequired,
};

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			loginLoading: false,
		};
		this.onLoginSubmit = this.onLoginSubmit.bind(this);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
	}
	onLoginSubmit(evt) {
		evt.preventDefault();
		this.setState({ loginLoading: true });

		return apiFetch('/api/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: this.state.email.toLowerCase(),
				password: SHA3(this.state.password).toString(encHex),
			})
		})
		.then((result)=> {
			console.log(result);
		});
	}

	onEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}

	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}
	render() {
		return (
			<div id="login-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					isBasePubPub={this.props.isBasePubPub}
					hideFooter={true}
				>
					<div className="container small">
						<div className="row">
							<div className="col-12">
								<h1>Login</h1>

								<form onSubmit={this.onLoginSubmit}>
									<InputField
										label="Email"
										placeholder="example@email.com"
										value={this.state.email}
										onChange={this.onEmailChange}
									/>
									<InputField
										label="Password"
										type="password"
										value={this.state.password}
										onChange={this.onPasswordChange}
										helperText={<a href="/password-reset">Forgot Password</a>}
									/>
									<InputField error={this.props.loginData.error}>
										<Button
											name="login"
											type="submit"
											className="pt-button pt-intent-primary"
											onClick={this.onLoginSubmit}
											text="Login"
											disabled={!this.state.email || !this.state.password}
											loading={this.state.loading}
										/>
									</InputField>
								</form>

								<a href="/signup" className="switch-message">Don't have an account? Click to Signup</a>
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Login.propTypes = propTypes;
export default Login;

hydrateWrapper(Login);
