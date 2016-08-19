import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {Link} from 'react-router';
import {Loader} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const SignUpForm = React.createClass({
	propTypes: {
		submitHandler: PropTypes.func,
		errorMessage: PropTypes.string,
		isLoading: PropTypes.bool,
	},

	getInitialState() {
		return {
			validationError: undefined,
		};
	},

	validate: function(signUpData) {
		// Check to make sure firstName exists
		if (!signUpData.firstName || !signUpData.firstName.length) {
			return {isValid: false, validationError: <FormattedMessage id="signup.FirstNamerequired" defaultMessage="First Name required"/>};
		}

		// Check to make sure lastName exists
		if (!signUpData.lastName || !signUpData.lastName.length) {
			return {isValid: false, validationError: <FormattedMessage id="signup.LastNamerequired" defaultMessage="Last Name required"/>};
		}

		// Check to make sure email exists
		if (!signUpData.email || !signUpData.email.length) {
			return {isValid: false, validationError: <FormattedMessage id="signup.Emailrequired" defaultMessage="Email required"/>};
		}

		// Check to make sure email is lightly valid (complete validation is impossible in JS - so just check for the most common error)
		const regexTest = /\S+@\S+/;
		if (!regexTest.test(signUpData.email)) {
			return {isValid: false, validationError: <FormattedMessage id="signup.Emailisinvalid" defaultMessage="Email is invalid"/>};
		}

		// Check to make sure password exists
		if (!signUpData.password || signUpData.password.length < 8) {
			return {isValid: false, validationError: <FormattedMessage id="signup.Passwordtooshort" defaultMessage="Password too short"/>};
		}

		return {isValid: true, validationError: undefined};

	},

	signUpSubmit: function(evt) {
		evt.preventDefault();
		const signUpData = {
			firstName: this.refs.firstName.value,
			lastName: this.refs.lastName.value,
			email: this.refs.email.value,
			password: this.refs.password.value
		};
		const {isValid, validationError} = this.validate(signUpData);
		this.setState({validationError: validationError});
		if (isValid) {
			this.props.submitHandler(signUpData);	
		}
	},

	render: function() {
		const metaData = {
			title: 'PubPub | Sign Up',
		};
		const serverErrors = {
			emailAlreadyUsed: <FormattedMessage id="signup.Emailalreadyused" defaultMessage="Email already used"/>
		};
		const isLoading = this.props.isLoading;
		const errorMessage = serverErrors[this.props.errorMessage] || this.state.validationError;

		return (
			<div>
				<Helmet {...metaData} />

				<h1><FormattedMessage {...globalMessages.SignUp}/></h1>
				<p style={styles.subHeader}>
					<FormattedMessage id="signup.Signupto" defaultMessage="Sign up to publish documents and follow content!"/>
				</p>
				
				<form onSubmit={this.signUpSubmit}>
					<div>
						<label style={styles.label} htmlFor={'firstName'}>
							<FormattedMessage {...globalMessages.FirstName}/>
						</label>
						<input ref={'firstName'} id={'firstName'} name={'first name'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'lastName'}>
							<FormattedMessage {...globalMessages.LastName}/>
						</label>
						<input ref={'lastName'} id={'lastName'} name={'last name'} type="text" style={styles.input}/>
					</div>


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
						<div className={'light-color inputSubtext'} to={'/resetpassword'}>
							<FormattedMessage id="signup.PasswordLength" defaultMessage="Must be at least 8 characters"/>
						</div>
					</div>

					<button className={'button'} onClick={this.signUpSubmit}>
						<FormattedMessage {...globalMessages.SignUp}/>
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
				
				<Link style={styles.registerLink} to={'/login'}>
					<FormattedMessage id="signup.alreadyHaveAccount" defaultMessage="Already have an account? Click to Login!"/>
				</Link>
				
			</div>
		);
	}

});

export default Radium(SignUpForm);

styles = {
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
