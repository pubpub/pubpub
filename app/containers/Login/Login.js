import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import Radium from 'radium';
import Helmet from 'react-helmet';

import { Button } from '@blueprintjs/core';
import { globalStyles } from 'utils/globalStyles';


import { login } from './actions';

let styles = {};

export const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
		
	},

	getInitialState() {
		return {
			email: '',
			password: '',
		};
	},

	componentDidMount: function() {
		this.initFocusInput.focus(); 
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.loginData.loading;
		const nextLoading = nextProps.loginData.loading;
		const nextError = nextProps.loginData.error;

		if (oldLoading && !nextLoading && !nextError) {
			const redirectRoute = this.props.location.query && this.props.location.query.redirect;
			if (redirectRoute && redirectRoute.indexOf('https://') > -1) {
				window.location.href = redirectRoute;
			} else {
				browserHistory.push(redirectRoute || '/');	
			}
			
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

	handleLoginSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.state.email, this.state.password));
	},

	render: function() {
		const loginData = this.props.loginData || {};
		const isLoading = loginData.loading;
		const error = loginData.error;
		
		return (
			<div style={styles.container}>
				<Helmet title={'Login · PubPub'} />

				<h1>Login</h1>

				<form onSubmit={this.handleLoginSubmit}>
					<div>
						<label style={styles.label} htmlFor={'email'}>
							Email
						</label>
						<input className={'pt-input margin-bottom'} ref={(input)=> { this.initFocusInput = input; }} id={'email'} name={'email'} type="text" style={styles.input} value={this.state.email} onChange={this.inputUpdateLowerCase.bind(this, 'email')} />
					</div>

					<div>
						<label style={styles.label} htmlFor={'password'}>
							Password
						</label>
						<input className={'pt-input margin-bottom'} id={'password'} name={'password'} type="password" style={styles.input} value={this.state.password} onChange={this.inputUpdate.bind(this, 'password')} />
						<Link className={'light-color inputSubtext'} to={'/resetpassword'}>
							Forgot Password?
						</Link>
					</div>

					<Button 
						name={'login'} 
						type={'submit'}
						className={'pt-button pt-intent-primary'} 
						onClick={this.handleLoginSubmit}
						text={'Login'}
						loading={isLoading} />

					{error &&
						<div style={styles.errorMessage}>
							Invalid Email or Password
						</div>	
					}
				</form>

				<Link to={'/signup'} style={styles.registerLink}>
					New to PubPub? Click to Sign Up!
				</Link>	
				

			</div>
		);
	}

});


function mapStateToProps(state) {
	return {
		loginData: state.login.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Login));

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
	errorMessage: {
		margin: '1em 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		display: 'block',
		margin: '1em 0em',
	},
	
};
