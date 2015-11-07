import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {toggleVisibility, login, logout} from '../../actions/login';
import {LoaderIndeterminate} from '../../components';

let styles = {};

const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
		fields: PropTypes.object,
		handleSubmit: PropTypes.func,
		resetForm: PropTypes.func,
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

	render: function() {
		const {
			fields: {email, password},
			handleSubmit,
			resetForm
		} = this.props;
		return (
			<div style={[
				styles.container,
				this.props.loginData.get('isVisible') && styles.visible
			]}>			

				<h2 style={styles.text}>Login</h2>
				<p style={styles.text}>Hello Please Login!</p>
				<h3 onClick={this.toggleLogin} style={styles.text}>cancel</h3>
				<h3 onClick={this.submitLogin} style={styles.text}>Submit Login</h3>
				<h3 onClick={this.submitLogout} style={styles.text}>LogOut</h3>
				<form>
					<div>
						<label>Email</label>
						<input type="text" placeholder="email" {...email}/>
					</div>
					<div>
						<label>Password</label>
						<input type="text" placeholder="password" {...password}/>
					</div>

				</form>
				{(this.props.loginData.get('loggingIn') === true ? <LoaderIndeterminate /> : null)}
				<p style={styles.text}>{JSON.stringify(this.props.loginData)}</p>


			</div>
		);
	}

});

const LoginForm = reduxForm({
	form: 'loginForm',
	fields: ['email', 'password']
})(Login);

export default connect( state => {
	return {loginData: state.login};
})( Radium(LoginForm) );

styles = {
	visible: {
		opacity: 0.98,
		pointerEvents: 'auto',
	},
	container: {
		transition: '.2s ease-in opacity',
		opacity: 0,
		pointerEvents: 'none',
		// backgroundColor: '#0E0E0E',
		backgroundColor: 'white',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: 1000,
		overflow: 'hidden',
	},
	text: {
		color: 'black',
		textAlign: 'center',
	}
};
