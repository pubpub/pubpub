import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
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
		query: PropTypes.object,
	},

	handleLoginSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},

	componentWillReceiveProps(nextProps) {
		// If there is a new username in loginData, login was a sucess, so redirect
		const oldUsername = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
		const newUsername = nextProps.loginData && nextProps.loginData.getIn(['userData', 'username']);
		if (newUsername && oldUsername !== newUsername) {
			const redirectRoute = this.props.query && this.props.query.redirect;
			this.props.dispatch(pushState(null, (redirectRoute || '/')));
		}
	},

	render: function() {
		const metaData = {
			title: 'PubPub Login',
		};
		const isLoading = this.props.loginData && this.props.loginData.get('loading');
		const errorMessage = this.props.loginData && this.props.loginData.get('error');
		const redirectRoute = this.props.query && this.props.query.redirect;
		const redirectQuery = redirectRoute ? '?redirect=' + redirectRoute : '';

		return (
			<div className={'login-container section'} style={styles.container}>
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
						<Link className={'light-color inputSubtext'} to={'/resetpassword'}>
							<FormattedMessage id="login.ForgotPassword" defaultMessage="Forgot Password?"/>
						</Link>
					</div>

					<button className={'button'} onClick={this.handleLoginSubmit}>
						<FormattedMessage {...globalMessages.Login}/>
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
				
				<Link style={styles.registerLink} to={'/signup' + redirectQuery}>
					<FormattedMessage id="login.newToPubPub" defaultMessage="New to PubPub? Click to Sign Up!"/>
				</Link>
				
			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login,
		query: state.router.location.query
	};
})( Radium(Login) );

styles = {
	container: {
		width: '500px',
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
