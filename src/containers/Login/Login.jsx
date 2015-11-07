import React, { PropTypes } from 'react';
import {connect} from 'react-redux';

import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {toggleVisibility, login, logout} from '../../actions/login';
import {LoaderIndeterminate, LoginForm, LoginFormRegister} from '../../components';

let styles = {};

const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	mixins: [PureRenderMixin],

	toggleLogin: function() {
		this.props.dispatch(toggleVisibility());
	},

	submitLogin: function() {
		this.props.dispatch(login('trich@media.mit.edu', 'password'));
	},

	submitLogout: function() {
		this.props.dispatch(logout());
	},

	handleLoginSubmit: function(formValues) {
		// console.log('inHandleLoginSubmit');
		this.props.dispatch(login(formValues.email, formValues.password));
		// console.log(formValues);
	},

	handleLoginRegisterSubmit: function(formValues) {
		console.log('inHandleLoginREgisterSubmit');
		// this.props.dispatch(login(formValues.email, formValues.password));
		console.log(formValues);
	},

	render: function() {
		return (
			<div style={[
				styles.container,
				this.props.loginData.get('isVisible') && styles.visible
			]}>			

				<h2 style={styles.text}>Login</h2>
				{(this.props.loginData.get('loggingIn') === true ? <LoaderIndeterminate color="white"/> : null)}
				
				<h3 onClick={this.toggleLogin} style={styles.text}>cancel</h3>
				<h3 onClick={this.submitLogin} style={styles.text}>Submit Login</h3>
				<h3 onClick={this.submitLogout} style={styles.text}>LogOut</h3>
				
				{(this.props.loginData.get('isVisible') 
					? (<div>
							<LoginForm onSubmit={this.handleLoginSubmit}/>
							<LoginFormRegister onSubmit={this.handleLoginRegisterSubmit}/>
						</div>)
					: null
				)}
				
				
				<p style={styles.text}>{JSON.stringify(this.props.loginData)}</p>


			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(Login) );

styles = {
	visible: {
		opacity: 0.98,
		pointerEvents: 'auto',
	},
	container: {
		transition: '.2s ease-in opacity',
		opacity: 0,
		pointerEvents: 'none',
		backgroundColor: '#0E0E0E',
		// backgroundColor: 'white',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: 1000,
		overflow: 'hidden',
	},
	text: {
		color: 'white',
		textAlign: 'center',
	}
};
