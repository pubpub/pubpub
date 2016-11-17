import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
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
				<Helmet title={'Login · PubPub'} />

				{!this.props.signUpData.destinationEmail && 
					<div>
						<h1>Sign Up</h1>
						<p>Enter your email to signup for PubPub. We'll send you a link to create your account!</p>
						<form onSubmit={this.handleSubmit} style={styles.form}>
							<label htmlFor={'email'}>
								Email
								<input id={'email'} name={'email'} type="email" value={this.state.email} onChange={(evt)=>{ this.setState({ email: evt.target.value.toLowerCase() }); }} />
							</label>
							
							<button className={'pt-button pt-intent-primary'} name={'login'} onClick={this.handleSubmit}>
								Sign Up
							</button>
							<div style={styles.errorMessage}>{this.props.signUpData.error}</div>
						</form>
					</div>
				}

				{this.props.signUpData.destinationEmail && 
					<div>
						<h1>Sign Up</h1>
						<p>A link to create your account has been sent to {this.props.signUpData.destinationEmail}</p>
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
		width: '500px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
};
