import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import Radium from 'radium';
import {login} from './actions';
import SignUpForm from './SignUpForm';
import SignUpDetails from './SignUpDetails';
import SignUpFollow from './SignUpFollow';

let styles = {};

export const SignUp = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
		query: PropTypes.object,
	},

	signUpSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},
	detailsSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},
	followsSubmit: function(evt) {
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
		const signUpMode = this.props.query && this.props.query.step;
		
		return (
			<div className={'signup-container'} style={styles.container}>

				{/* Sign Up Form */}
				{signUpMode !== 'details' && signUpMode !== 'follow' && // Render if default Sign Up mode
					<SignUpForm 
						submitHandler={this.signUpSubmit} 
						errorMessage={errorMessage}
						isLoading={isLoading}/>
				}

				{/* Sign Up Details */}
				{signUpMode === 'details' && // Render if details Sign Up mode
					<SignUpDetails
						submitHandler={this.detailsSubmit} 
						errorMessage={errorMessage}
						isLoading={isLoading}/>
				}

				{/* Sign Up Follow */}
				{signUpMode === 'follow' && // Render if details Sign Up mode
					<SignUpFollow
						submitHandler={this.followsSubmit} 
						errorMessage={errorMessage}
						isLoading={isLoading}/>
				}
				
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
	}
};
