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

	signUpSubmit: function(evt) {
		evt.preventDefault();
		this.props.submitHandler({password: 'cat', email: 'email', firstName: 'john'});
		// this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},

	render: function() {
		const metaData = {
			title: 'PubPub | Sign Up',
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.errorMessage;

		return (
			<div className={'signup-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1><FormattedMessage {...globalMessages.SignUp}/></h1>
				<p style={styles.subHeader}>Sign up to publish documents and follow content!</p>
				<form onSubmit={this.signUpSubmit}>
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

					<button className={'button'} onClick={this.signUpSubmit}>
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
