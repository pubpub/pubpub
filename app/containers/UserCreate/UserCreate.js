import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button, NonIdealState } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import { getSignupData, postUser } from 'actions/userCreate';

require('./userCreate.scss');

const propTypes = {
	userCreateData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class UserCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			password: '',
		};
		this.onCreateSubmit = this.onCreateSubmit.bind(this);
		this.onFirstNameChange = this.onFirstNameChange.bind(this);
		this.onLastNameChange = this.onLastNameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
	}

	componentWillMount() {
		this.props.dispatch(getSignupData(this.props.match.params.hash));
	}

	componentWillReceiveProps(nextProps) {
		const prevData = this.props.userCreateData.data || {};
		const nextData = nextProps.userCreateData.data || {};
		if (!prevData.id && nextData.id) {
			this.props.history.push('/');
		}
	}

	onCreateSubmit(evt) {
		evt.preventDefault();
		this.props.dispatch(postUser(
			this.props.userCreateData.data.email,
			this.props.userCreateData.data.hash,
			this.state.firstName,
			this.state.lastName,
			SHA3(this.state.password).toString(encHex),
		));
	}

	onFirstNameChange(evt) {
		this.setState({ firstName: evt.target.value });
	}
	onLastNameChange(evt) {
		this.setState({ lastName: evt.target.value });
	}
	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}

	render() {
		return (
			<div className={'user-create'}>
				<Helmet>
					<title>User Create</title>
				</Helmet>

				{this.props.userCreateData.hashError &&
					<NonIdealState
						title={'Signup URL Invalid'}
						description={
							<div className={'success'}>
								<p>This URL cannot be used to signup.</p>
								<p>Click below to restart the signup process.</p>
							</div>
						}
						visual={'error'}
						action={<Link to={'/signup'} className={'pt-button'}>Signup</Link>}
					/>
				}

				{this.props.userCreateData.data &&
					<div className={'container small'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<h1>Create Account</h1>
								<form onSubmit={this.onCreateSubmit}>
									<InputField
										label={'Email'}
										isDisabled={true}
										value={this.props.userCreateData.data.email}
									/>
									<InputField
										label={'First Name'}
										isRequired={true}
										value={this.state.firstName}
										onChange={this.onFirstNameChange}
									/>
									<InputField
										label={'Last Name'}
										isRequired={true}
										value={this.state.lastName}
										onChange={this.onLastNameChange}
									/>
									<InputField
										label={'Password'}
										type={'password'}
										isRequired={true}
										value={this.state.password}
										onChange={this.onPasswordChange}
										error={this.props.userCreateData.error && 'Error Creating User'}
									/>
									<Button
										name={'create'}
										type={'submit'}
										className={'pt-button pt-intent-primary'}
										onClick={this.onCreateSubmit}
										text={'Create Account'}
										disabled={!this.state.firstName || !this.state.lastName || !this.state.password}
										loading={this.props.userCreateData.isLoading}
									/>
								</form>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}

UserCreate.propTypes = propTypes;
export default withRouter(connect(state => ({
	userCreateData: state.userCreate,
}))(UserCreate));
