import React, {PropTypes} from 'react';
//React is the UI functionality. {PropTypes} is used to validate the type of a prop recieved.
//The {} are because it is not the defualt export. This is only used in devmode. 'react' is node module. 
import {connect} from 'react-redux';
//{connect} is used to generate containers for "Dumb/Pure" components.
//Connect(function ReduxState->Prop)(React component). React component takes props and returns UI.
import {pushState} from 'redux-router';
//Stores router state in redux store. See differences between React-router-redux and redux-router.
import Radium from 'radium';
//Styling tools for react. CSS free. Imports whole.
import Helmet from 'react-helmet';
//I dont understand this but i think it has to do with global stuff.
import {login} from './actions';
//Grabs exported {login} function from actions.js. Login is an Action Creator, given email/passs, returns action.
import {Link} from 'react-router';
//React-Router maps different routes to various react componenets. Link Routes from app files.
import {Loader} from 'components';
//Components forlder has an index.js that exports Loader.jsx from Louder folder
//Loader is a component.


import {globalStyles} from 'utils/styleConstants'; //These are global styles, accessed from utilities.
import {globalMessages} from 'utils/globalMessages'; //These are global messages, accessed from utilities.
import {FormattedMessage} from 'react-intl'; //Used for international language functionality.

let styles = {}; //local variable

//React export readonly value. Value is React.CreateClass
export const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
		query: PropTypes.object,
	},
	//Checks that props are correct type. Error if otherwise.

	handleLoginSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},
	//Calls dispatch function on Login action. Dispatch is from props.
	//Where is dispatch/logindata from?

	componentWillReceiveProps(nextProps) {
		//If there is a new username in loginData, login was a sucess, so redirect
		//&& is inline conditional operator
		const oldUsername = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
		const newUsername = nextProps.loginData && nextProps.loginData.getIn(['userData', 'username']);
		if (newUsername && oldUsername !== newUsername) {
			//new username exists and is not the same as oldusername
			const redirectRoute = this.props.query && this.props.query.redirect;
			this.props.dispatch(pushState(null, (redirectRoute || '/')));
		}
	},

	render: function() {
		const metaData = {
			title: 'PubPub Login',
		};
		const isLoading = this.props.loginData && this.props.loginData.get('loading');
		const errorMessage = this.props.loginData && this.props.loginData.get('error');
		const redirectRoute = this.props.query && this.props.query.redirect;
		const redirectQuery = redirectRoute ? '?redirect=' + redirectRoute : '';

		return (
			<div className={'login-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1><FormattedMessage {...globalMessages.Login}/></h1>

				<form onSubmit={this.handleLoginSubmit}>
					<div>
						<label style={styles.label} htmlFor={'email'}>
							<FormattedMessage {...globalMessages.Email} />
						</label>
						<input ref={'loginEmail'} id={'email'} name={'email'} type="text" style={styles.input}/>
					</div>

					<div>
						<label style={styles.label} htmlFor={'password'}>
							<FormattedMessage {...globalMessages.Password} />
						</label>
						<input ref={'loginPassword'} id={'password'} name={'password'} type="password" style={styles.input}/>
						<Link className={'light-color inputSubtext'} to={'/resetpassword'}>
							<FormattedMessage id="login.ForgotPassword" defaultMessage="Forgot Password?"/>
						</Link>
					</div>

					<button className={'button'} onClick={this.handleLoginSubmit}>
						<FormattedMessage {...globalMessages.Login}/>
					</button>

					<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
				
				<Link style={styles.registerLink} to={'/signup' + redirectQuery}>
					<FormattedMessage id="login.newToPubPub" defaultMessage="New to PubPub? Click to Sign Up!"/>
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
})( Radium(Login) );

styles = {
	container: {
		width: '500px',
		padding: '0px 15px',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)',
		}
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
