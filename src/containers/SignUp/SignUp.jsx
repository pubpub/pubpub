import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import Radium from 'radium';
import {signup, signupDetails} from './actions';
import SignUpForm from './SignUpForm';
import SignUpDetails from './SignUpDetails';

let styles = {};

export const SignUp = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		signUpData: PropTypes.object,
		dispatch: PropTypes.func,
		query: PropTypes.object,
	},

	signUpSubmit: function(signUpData) {
		this.props.dispatch(signup(signUpData.firstName, signUpData.lastName, signUpData.email, signUpData.password));
	},
	detailsSubmit: function(detailsData) {
		this.props.dispatch(signupDetails(detailsData.image, detailsData.bio, detailsData.website, detailsData.twitter, detailsData.orcid, detailsData.github, detailsData.googleScholar));
	},

	componentWillReceiveProps(nextProps) {
		// If the currentStage has changed, update the route
		const lastStage = this.props.signUpData && this.props.signUpData.get('currentStage');
		const nextStage = nextProps.signUpData && nextProps.signUpData.get('currentStage');
		
		if (lastStage !== nextStage) { // If the stage has changed
			const redirectRoute = this.props.query && this.props.query.redirect;

			// If the signup process is complete, redirect the path
			// else update the stage query
			if (nextStage === 'complete') { 
				this.props.dispatch(pushState(null, (redirectRoute || '/')));	
			} else {
				this.props.dispatch(pushState(null, '/signup', {redirect: redirectRoute, stage: nextStage}));	
			}
		}
	},

	render: function() {
		const loggedIn = this.props.loginData && this.props.loginData.get('loggedIn');
		const isLoading = this.props.signUpData && this.props.signUpData.get('loading');
		const errorMessage = this.props.signUpData && this.props.signUpData.get('error');
		const signUpMode = loggedIn && this.props.query && this.props.query.stage; // If not logged in, signUpMode is false, trigger <SignUpForm> to render, otherwise set mode to query
		const userImage = this.props.loginData && this.props.loginData.getIn(['userData', 'image']);

		const redirectRoute = this.props.query && this.props.query.redirect;

		return (
			<div className={'signup-container section'} style={styles.container}>

				{/* Sign Up Form */}
				{signUpMode !== 'details' && // Render if not details stage (this is default)
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
						isLoading={isLoading}
						userImage={userImage} 
						redirectRoute={redirectRoute}/>
				}
				
			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login,
		signUpData: state.signUp,
		query: state.router.location.query
	};
})( Radium(SignUp) );

styles = {
	container: {
		width: '500px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	}
};
