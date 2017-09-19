import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import { postLogin } from 'actions/login';


require('./login.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
};

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.onLoginSubmit = this.onLoginSubmit.bind(this);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.loginData.data && nextProps.loginData.data) {
			this.props.history.push('/');
		}
	}

	onLoginSubmit(evt) {
		evt.preventDefault();
		this.props.dispatch(postLogin(
			this.state.email.toLowerCase(),
			SHA3(this.state.password).toString(encHex))
		);
	}

	onEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}

	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}

	render() {
		return (
			<div className={'login'}>
				<Helmet>
					<title>Login</title>
				</Helmet>

				<div className={'container small'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Login</h1>

							<form onSubmit={this.onLoginSubmit}>
								<InputField
									label={'Email'}
									placeholder={'example@email.com'}
									value={this.state.email}
									onChange={this.onEmailChange}
								/>
								<InputField
									label={'Password'}
									type={'password'}
									value={this.state.password}
									onChange={this.onPasswordChange}
									error={this.props.loginData.error}
								/>
								<Button
									name={'login'}
									type={'submit'}
									className={'pt-button pt-intent-primary'}
									onClick={this.onLoginSubmit}
									text={'Login'}
									disabled={!this.state.email || !this.state.password}
									loading={this.props.loginData.isLoading}
								/>
							</form>

							<Link to={'/signup'} className={'switch-message'}>Don't have an account? Click to Signup</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = propTypes;
export default withRouter(connect(state => ({
	loginData: state.login,
}))(Login));
