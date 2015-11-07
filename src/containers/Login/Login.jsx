import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {toggleVisibility, toggleViewMode, login, logout, register} from '../../actions/login';
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

	toggleViewMode: function() {
		this.props.dispatch(toggleViewMode());
	},

	submitLogin: function() {
		this.props.dispatch(login('trich@media.mit.edu', 'password'));
	},

	submitLogout: function() {
		this.props.dispatch(logout());
	},

	handleLoginSubmit: function(formValues) {
		this.props.dispatch(login(formValues.email, formValues.password));
	},

	handleLoginRegisterSubmit: function(formValues) {
		this.props.dispatch(register(formValues.email, formValues.password, formValues.fullName, 'https://s3.amazonaws.com/37assets/svn/1065-IMG_2529.jpg'));
	},

	render: function() {
		const viewMode = this.props.loginData.get('viewMode');
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
				<h3 onClick={this.toggleViewMode} style={styles.text}>ViewMode</h3>
				
				<div style={[styles.form, styles[viewMode].login]}>
					<LoginForm onSubmit={this.handleLoginSubmit} />
				</div>

				<div style={[styles.form, styles[viewMode].register]}>
					<LoginFormRegister onSubmit={this.handleLoginRegisterSubmit} />
				</div>
				
				<p style={styles.text}>{JSON.stringify(this.props.loginData)}</p>


			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(Login) );

styles = {
	form: {
		opacity: 0,
		transition: '.1s linear opacity',
	},
	login: {
		login: {
			opacity: 1
		}
	},
	register: {
		register: {
			opacity: 1
		}
	},
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
