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

export const SignUp = React.createClass({
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
		// TODO if mode is details or follow, and not logged in, redirect to login page

		// If there is a new username in loginData, login was a sucess, so redirect
		const oldUsername = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
		const newUsername = nextProps.loginData && nextProps.loginData.getIn(['userData', 'username']);
		if (newUsername && oldUsername !== newUsername) {
			const userProfile = '/user/' + newUsername;
			const redirectQuery = this.props.query && this.props.query.redirect;
			this.props.dispatch(pushState(null, (redirectQuery || userProfile)));
		}
	},

	render: function() {
		const isLoading = this.props.loginData && this.props.loginData.get('loading');
		const errorMessage = this.props.loginData && this.props.loginData.get('error');

		return (
			<div className={'signup-container'} style={styles.container}>

				<h1><FormattedMessage {...globalMessages.SignUp}/></h1>
				<p style={styles.subHeader}>Sign up to publish documents and follow content!</p>
				<form onSubmit={this.handleLoginSubmit}>
					<div>
						<label style={styles.label} htmlFor={'firstName'}>
							<FormattedMessage id="signup.FirstName" defaultMessage="First Name"/>
						</label>
						<input ref={'signupFirstName'} id={'firstName'} name={'first name'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'lastName'}>
							<FormattedMessage id="signup.LastName" defaultMessage="Last Name"/>
						</label>
						<input ref={'signupLastName'} id={'lastName'} name={'last name'} type="text" style={styles.input}/>
					</div>


					<div>
						<label style={styles.label} htmlFor={'email'}>
							<FormattedMessage {...globalMessages.Email} />
						</label>
						<input ref={'signupEmail'} id={'email'} name={'email'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'password'}>
							<FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'signupPassword'} id={'password'} name={'password'} type="password" style={styles.input}/>
						<div className={'light-color inputSubtext'} to={'/resetpassword'}>
							<FormattedMessage id="signup.PasswordLength" defaultMessage="Must be 8-32 characters long"/>
						</div>
					</div>

					<button className={'button'} onClick={this.handleLoginSubmit}>
						<FormattedMessage {...globalMessages.SignUp}/>
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
				
				<Link style={styles.registerLink} to={'/login'}>
					<FormattedMessage id="signup.alreadyHaveAccount" defaultMessage="Already have a PubPub? Click to Login!"/>
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
})( Radium(SignUp) );

styles = {
	container: {
		width: '500px',
		padding: '0px 15px',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)',
		}
	},
	subHeader: {  
		margin: '-20px 0px 20px 0px',
		fontSize: '0.9em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
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
