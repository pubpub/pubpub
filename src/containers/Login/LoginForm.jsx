import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';

import {globalMessages} from 'utils/globalMessages';
import {injectIntl, FormattedMessage} from 'react-intl';

let styles = {};

const LoginForm = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		intl: PropTypes.object,
		toggleVisibility: PropTypes.func,
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
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.Email} />
					</label>
					<input key="loginEmail" style={styles.input} type="text" placeholder={this.props.intl.formatMessage(globalMessages.Email)} {...email}/>
				</div>
				<div>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.Password} />
					</label>
					<input key="loginPassword" style={styles.input} type="password" placeholder={this.props.intl.formatMessage(globalMessages.Password)} {...password}/>
					<div style={globalStyles.clearFix}></div>
					<Link to={'/resetpassword'}>
						<div style={styles.forgot} key={'forgotPasswordButton'} onClick={this.props.toggleVisibility}>Forgot Password</div>
					</Link>
				</div>
				<button type="submit" key="loginSubmit" style={styles.submit} onClick={handleSubmit}>
					<FormattedMessage {...globalMessages.Submit} />
				</button>
			</form>
		);
	}
});

export default reduxForm({
	form: 'loginForm',
	fields: ['email', 'password']
})(injectIntl(Radium(LoginForm)));

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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'relative',
			top: 0,
			left: 0,
			width: '200px',
			marginLeft: 'calc(100% - 200px)',
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			margin: 30,
			width: 'calc(100% - 60px)',


		},
	},
	forgot: {
		color: '#999',
		display: 'inline-block',
		padding: '10px 0px',
		margin: '5px 30px',
		':hover': {
			color: 'white',
		}
	},

};
