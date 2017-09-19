import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Button, NonIdealState } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import { postSignup } from 'actions/signup';

require('./signup.scss');

const propTypes = {
	signupData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			isSuccessful: false,
		};
		this.onSignupSubmit = this.onSignupSubmit.bind(this);
		this.onEmailChange = this.onEmailChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.signupData.data && nextProps.signupData.data) {
			this.setState({ isSuccessful: true });
		}
	}

	onSignupSubmit(evt) {
		evt.preventDefault();
		this.props.dispatch(postSignup(this.state.email));
	}

	onEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}

	render() {
		return (
			<div className={'signup'}>
				<Helmet>
					<title>Signup</title>
				</Helmet>

				<div className={'container small'}>
					<div className={'row'}>
						<div className={'col-12'}>
							{!this.state.isSuccessful &&
								<div>
									<h1>Signup</h1>
									<form onSubmit={this.onSignupSubmit}>
										<InputField
											label={'Email'}
											placeholder={'example@email.com'}
											value={this.state.email}
											onChange={this.onEmailChange}
											error={this.props.signupData.error}
										/>
										<Button
											name={'signup'}
											type={'submit'}
											className={'pt-button pt-intent-primary'}
											onClick={this.onSignupSubmit}
											text={'Signup'}
											disabled={!this.state.email}
											loading={this.props.signupData.isLoading}
										/>
									</form>
									<Link to={'/login'} className={'switch-message'}>Already have an account? Click to Login</Link>
								</div>
							}

							{this.state.isSuccessful &&
								<NonIdealState
									title={'Signup Successful'}
									description={
										<div className={'success'}>
											<p>An email has been sent to <b>{this.state.email}</b></p>
											<p>Follow the link in that email to create your account.</p>
										</div>
									}
									visual={'tick-circle'}
									action={
										<Button
											name={'resendEmail'}
											type={'button'}
											className={'pt-button'}
											onClick={this.onSignupSubmit}
											text={'Resend Email'}
											loading={this.props.signupData.isLoading}
										/>
									}
								/>
							}

						</div>
					</div>
				</div>
			</div>
		);
	}
}

Signup.propTypes = propTypes;
export default withRouter(connect(state => ({
	signupData: state.signup,
}))(Signup));
