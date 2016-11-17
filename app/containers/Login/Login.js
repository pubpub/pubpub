import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Radium from 'radium';
import Helmet from 'react-helmet';


import { Loader } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { login } from './actions';

let styles = {};

export const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		query: PropTypes.object,
		dispatch: PropTypes.func,
		
	},

	handleLoginSubmit: function(evt) {
		evt.preventDefault();
		const email = this.refs.email.value || '';
		this.props.dispatch(login(email.toLowerCase(), this.refs.password.value));
	},

	// componentWillMount() {
	// 	const newUsername = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
	// 	if (newUsername) {
	// 		// new username exists and is not the same as oldusername
	// 		const redirectRoute = this.props.query && this.props.query.redirect;
	// 		this.props.dispatch(push(redirectRoute || '/'));
	// 	}
	// },
	// componentWillReceiveProps(nextProps) {
	// 	// If there is a new username in loginData, login was a sucess, so redirect
	// 	const oldUsername = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
	// 	const newUsername = nextProps.loginData && nextProps.loginData.getIn(['userData', 'username']);
	// 	if (newUsername && oldUsername !== newUsername) {
	// 		// new username exists and is not the same as oldusername
	// 		const redirectRoute = this.props.query && this.props.query.redirect;
	// 		this.props.dispatch(push(redirectRoute || '/'));
	// 	}
	// },

	render: function() {
		const loginData = this.props.loginData || {};
		const isLoading = loginData.loading;
		const error = loginData.error;
		
		const redirectRoute = this.props.query && this.props.query.redirect;
		const redirectQuery = redirectRoute ? '?redirect=' + redirectRoute : '';

		return (
			<div style={styles.container}>
				<Helmet title={'Login · PubPub'} />

				<h1><FormattedMessage {...globalMessages.Login}/></h1>

				<form onSubmit={this.handleLoginSubmit}>
					<div>
						<label style={styles.label} htmlFor={'email'}>
							<FormattedMessage {...globalMessages.Email} />
						</label>
						<input ref={'email'} id={'email'} name={'email'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'password'}>
							<FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'password'} id={'password'} name={'password'} type="password" style={styles.input}/>
						<Link className={'light-color inputSubtext'} to={'/resetpassword'}>
							<FormattedMessage id="login.ForgotPassword" defaultMessage="Forgot Password?"/>
						</Link>
					</div>

					<button name={'login'} className={'pt-button pt-intent-primary'} onClick={this.handleLoginSubmit}>
						<FormattedMessage {...globalMessages.Login}/>
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!error}/></div>

					<div style={styles.errorMessage}>{error}</div>

				</form>

				<Link style={styles.registerLink} to={'/signup' + redirectQuery}>
					<FormattedMessage id="login.newToPubPub" defaultMessage="New to PubPub? Click to Sign Up!"/>
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
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		...globalStyles.link,
		display: 'block',
		margin: '3em 0em'
	}
};
