import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const LoginFormRegister = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		userImage: PropTypes.string,
		handleSubmit: PropTypes.func.isRequired,
		onFileSelect: PropTypes.func.isRequired,
		intl: PropTypes.object,
	},

	mixins: [PureRenderMixin],

	render: function() {
		const {
			fields: {email, password, firstName, lastName},
			handleSubmit
		} = this.props;

		const messages = defineMessages({
			firstName: {
				id: 'login.firstName',
				defaultMessage: 'First Name',
			},
			lastName: {
				id: 'login.lastName',
				defaultMessage: 'Last Name',
			},
		});

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.Email} />
					</label>
					<input style={[styles.input, styles.shortInput]} key="registerEmail" type="text" placeholder={this.props.intl.formatMessage(globalMessages.Email)} {...email}/>
				</div>
				<div>
					<label style={styles.label}>
						<FormattedMessage {...globalMessages.Password} />
					</label>
					<input style={[styles.input, styles.shortInput]} key="registerpassword" type="password" placeholder={this.props.intl.formatMessage(globalMessages.Password)} {...password}/>
				</div>
				<div>
					<label style={styles.label}>
						{this.props.intl.formatMessage(messages.firstName)}
					</label>
					<input style={[styles.input, styles.shortInput, {clear: 'left'}]} key="registerFirstName" type="text" placeholder={this.props.intl.formatMessage(messages.firstName)} {...firstName}/>
				</div>
				<div>
					<label style={styles.label}>
						{this.props.intl.formatMessage(messages.lastName)}
					</label>
					<input style={[styles.input, styles.shortInput]} key="registerLastName" type="text" placeholder={this.props.intl.formatMessage(messages.lastName)} {...lastName}/>
				</div>

				<div style={[styles.input, styles.userImageInput]}>
					{/* <div style={styles.userInputDiv}>
							<FormattedMessage id="login.userImage" defaultMessage="User Image"/>
						</div> */}
					<img style={[styles.userInputDiv, styles.userImagePreview]} src={this.props.userImage} />
					<div style={[styles.userInputDiv, styles.fileInputWrapper]} key="userImageFileInputWrapper">
						<FormattedMessage id="login.chooseNew" defaultMessage="choose new image"/>
						<input style={styles.hiddenFileInput} type="file" accept="image/*" onChange={this.props.onFileSelect} />
					</div>
					
					
				</div>

				<button type="submit" key="registerSubmit" style={styles.submit} onClick={handleSubmit}>
					<FormattedMessage {...globalMessages.Submit} />
				</button>
			</form>
		);
	}
});

export default reduxForm({
	form: 'loginFormRegister',
	fields: ['firstName', 'lastName', 'email', 'password', 'image']
})(injectIntl(Radium(LoginFormRegister)));

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
	shortInput: {
		width: 'calc( ((100% - 155px - 10px - 10px - 100px) / 2) - 60px)',
	},
	userImageInput: {
		// width: 270,
		width: 175,
		height: 32,
		margin: '90px 10px 0px 0px',
	},
	userImagePreview: {
		width: 35,
		// padding: '0px 20px 0px 0px',
		position: 'relative',
		top: -5,
	},
	userInputDiv: {
		float: 'left',

	},
	fileInputWrapper: {
		// width: 70,
		width: 120,
		textAlign: 'center',
		height: 30,
		cursor: 'pointer',
		position: 'relative',
		fontSize: '14px',
		color: globalStyles.headerText,
		lineHeight: '26px',
		':hover': {
			color: globalStyles.headerHover,
		},
	},
	hiddenFileInput: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		outline: 'none',
		opacity: 0,
		left: 0,
		top: 0,
	},

};
