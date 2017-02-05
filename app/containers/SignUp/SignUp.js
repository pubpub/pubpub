import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { createSignUp } from './actions';
import { globalStyles } from 'utils/globalStyles';

let styles;

export const SignUp = React.createClass({
	propTypes: {
		signUpData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			email: '',
		};
	},

	componentDidMount: function() {
		if (!this.props.signUpData.destinationEmail) {
			this.initFocusInput.focus(); 	
		}
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase() });
	},

	handleSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(createSignUp(this.state.email));
	},

	resendEmail: function() {
		this.props.dispatch(createSignUp(this.props.signUpData.destinationEmail));
	},

	render() {

		return (
			<div style={styles.container}>
				<Helmet title={'Sign Up · PubPub'} />

				{!this.props.signUpData.destinationEmail && 
					<div>
						<h1>Sign Up</h1>

						<div className="pt-callout pt-intent-danger">
							<h5>SignUps disabled</h5>
							<p>We don't dispatch emails from this dev deployment, so you won't get a signup link by entering your email below.
							Instead, feel free to Login with one of the dev accounts to play around:</p>
							<ul>
								<li>test1@email.com</li>
								<li>test2@email.com</li>
								<li>test3@email.com</li>
								<li>test4@email.com</li>
							</ul>
							<p>All use password: 'password'.</p>
							<div>
								<Link to={'/login'} className={'pt-button pt-intent-primary'}>Login</Link>	
							</div>
							
						</div>

						<p>Enter your email to signup for PubPub. We'll send you a link to create your account!</p>

						<hr />

						<form onSubmit={this.handleSubmit} style={styles.form}>
							<label htmlFor={'email'}>
								Email
								<input className={'pt-input margin-bottom'} ref={(input)=> { this.initFocusInput = input; }} id={'email'} name={'email'} type="email" style={styles.input} value={this.state.email} onChange={this.inputUpdateLowerCase.bind(this, 'email')} />
							</label>
							
							<button className={'pt-button pt-intent-primary'} name={'login'} onClick={this.handleSubmit}>
								Email Sign Up Link
							</button>
							<div style={styles.errorMessage}>{this.props.signUpData.error}</div>
						</form>
					</div>
				}

				{this.props.signUpData.destinationEmail && 
					<div>
						<h1>Sign Up</h1>
						<p>A link to create your account has been sent to <b>{this.props.signUpData.destinationEmail}</b></p>
						
						<button className={'pt-button'} onClick={this.resendEmail}>Resend Email</button>
						{this.props.signUpData.loading &&
							<p>Resending</p>
						}
						{this.props.signUpData.resendSuccess &&
							<p>Email has been resent!</p>
						}
					</div>
				}
				
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		signUpData: state.signUp.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(SignUp));

styles = {
	container: {
		width: '600px',
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
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
};
