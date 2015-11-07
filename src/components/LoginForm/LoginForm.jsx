import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LoginForm = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
	},

	mixins: [PureRenderMixin],

	render: function() {
		const {
			fields: {email, password},
			handleSubmit
		} = this.props;

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<label style={styles.label}>Email</label>
					<input key="loginEmail" style={styles.input} type="text" placeholder="Email" {...email}/>
				</div>
				<div>
					<label style={styles.label}>Password</label>
					<input key="loginPassword" style={styles.input} type="password" placeholder="Password" {...password}/>
				</div>
				<button type="submit" key="loginSubmit" style={styles.submit} onClick={handleSubmit}>Submit</button>
			</form>
		);
	}
});

export default reduxForm({
	form: 'loginForm',
	fields: ['email', 'password']
})(Radium(LoginForm));

styles = {
	submit: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 160,
		height: 52,
		// backgroundColor: 'rgba(50,100,190,1)',
		color: globalStyles.headerText,
		textAlign: 'right',
		padding: '12px 20px',
		fontSize: '30px',
		cursor: 'pointer',
		':hover': {
			color: globalStyles.headerHover
		},
		backgroundColor: 'transparent',
		fontFamily: globalStyles.headerFont,
		borderWidth: '0px 0px 1px 0px',
		borderColor: 'transparent',
		':focus': {
			borderColor: globalStyles.headerHover,
			outline: 'none',
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			position: 'relative',
			top: 0,
			left: 0,
			width: '100%',
			height: '80px',
			lineHeight: '80px',
			padding: '0px 20px',


		},
	},
	label: {
		opacity: 0,
		position: 'absolute',
	},
	input: {
		borderWidth: '0px 0px 1px 0px',
		borderColor: globalStyles.headerText,
		backgroundColor: 'transparent',
		margin: '90px 30px 0px 30px',
		fontSize: '25px',
		color: globalStyles.headerText,
		float: 'left',
		':focus': {
			borderWidth: '0px 0px 1px 0px',
			borderColor: globalStyles.headerHover,
			outline: 'none',
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			float: 'none',
			margin: 30,
			width: 'calc(100% - 60px)',


		},
	}

};
