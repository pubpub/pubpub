import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {login} from './actions';
import {Link} from 'react-router';
import {Loader} from 'components';

import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	handleLoginSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},

	componentWillReceiveProps(nextProps) {
		const username = this.props.loginData && this.props.loginData.get('username');
		if (!!username){
			
		}
	},

	render: function() {
		const metaData = {
			title: 'PubPub Login',
		};
		const isLoading = this.props.loginData && this.props.loginData.get('loading');
		const errorMessage = this.props.loginData && this.props.loginData.get('error');

		return (
			<div className={'login-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1><FormattedMessage {...globalMessages.Login}/></h1>

				<form onSubmit={this.handleLoginSubmit}>
					<div>
						<label style={styles.label} htmlFor={'email'}>
							<FormattedMessage {...globalMessages.Email} />
						</label>
						<input ref={'loginEmail'} id={'email'} name={'email'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'password'}>
							<FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'loginPassword'} id={'password'} name={'password'} type="password" style={styles.input}/>
						<Link className={'light-color'} to={'/resetpassword'} style={styles.forgotPasswordLink}>
							<FormattedMessage id="login.ForgotPassword" defaultMessage="Forgot Password?"/>
						</Link>
					</div>

					<button className={'button'} style={styles.submit} onClick={this.handleLoginSubmit}>
						<FormattedMessage {...globalMessages.Login}/>
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
				
				<Link style={styles.registerLink} to={'/register'}>
					<FormattedMessage id="login.newToPubPub" defaultMessage="New to PubPub? Click to Sign Up!"/>
				</Link>
				
			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(Login) );

styles = {
	container: {
		width: '500px',
		padding: '0px 15px',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	forgotPasswordLink: {
		fontSize: '0.8em',
		textDecoration: 'none',
		position: 'relative',
		top: '-1.7em',
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
