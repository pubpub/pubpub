import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSignUp } from './actions';

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
				{!this.props.signUpData.destinationEmail && 
					<form onSubmit={this.handleSubmit} style={styles.form}>
						<input id={'email'} name={'email'} type="email" placeholder={'Email'} value={this.state.email} onChange={(evt)=>{ this.setState({ email: evt.target.value }); }} />
						<button name={'login'} onClick={this.handleSubmit}>
							Sign Up
						</button>
					</form>
				}

				{this.props.signUpData.destinationEmail && 
					<div>
						<p>A link to create your account has been sent to {this.props.signUpData.destinationEmail}</p>
						<p onClick={this.resendEmail}>Resend Email</p>
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

export default connect(mapStateToProps)(SignUp);

styles = {
	container: {
		padding: '1em'
	}
};
