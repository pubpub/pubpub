import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {toggleVisibility, toggleViewMode, login, register} from '../../actions/login';
import {ImageCropper, LoaderIndeterminate, LoginForm, LoginFormRegister} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const Login = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	mixins: [PureRenderMixin],

	getInitialState: function() {
		return {
			userImageFile: null,
			userImageURL: 'https://res.cloudinary.com/pubpub/image/upload/c_limit,h_50,w_50/v1448145108/yedqa0ks1s6bvgysv6on.png',
		};
	},

	toggleLogin: function() {
		this.setState({
			userImageFile: null,
			userImageURL: 'https://s3.amazonaws.com/pubpub-upload/users/pubHappy.png',
		});
		this.props.dispatch(toggleVisibility());
	},

	toggleViewMode: function() {
		this.setState({
			userImageFile: null,
			userImageURL: 'https://s3.amazonaws.com/pubpub-upload/users/pubHappy.png',
		});
		this.props.dispatch(toggleViewMode());
	},

	submitLogin: function() {
		this.props.dispatch(login('trich@media.mit.edu', 'password'));
	},


	handleLoginSubmit: function(formValues) {
		this.props.dispatch(login(formValues.email, formValues.password));
	},

	handleLoginRegisterSubmit: function(formValues) {
		this.props.dispatch(register(formValues.email, formValues.password, formValues.firstName, formValues.lastName, this.state.userImageURL));
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({userImageFile: evt.target.files[0]});	
		}
	},
	cancelImageUpload: function() {
		this.setState({userImageFile: null});
	},
	userImageUploaded: function(url) {
		this.setState({userImageFile: null, userImageURL: url});
	},

	render: function() {
		const viewMode = this.props.loginData.get('viewMode');
		return (
			<div className={'login-container'} style={[
				styles.container,
				this.props.loginData.get('isVisible') && styles.visible
			]}>			

				<div key="loginCancel" style={styles.cancel} onClick={this.toggleLogin}>
					<FormattedMessage {...globalMessages.cancel} />
				</div>
				<div style={styles.loaderContainer}>
					{(this.props.loginData.get('loggingIn') === true ? <LoaderIndeterminate color="white"/> : null)}
				</div>
				<div style={[styles.formWrapper, this.props.loginData.get('isVisible') && styles.formWrapperVisible]}>
					<div key="loginTitle" style={styles.title}>
						<FormattedMessage {...globalMessages[viewMode]} />
					</div>
					<div style={styles.errorMessage}>
						{this.props.loginData.get('error')}
					</div>
					<div style={styles.viewModeToggle} onClick={this.toggleViewMode}>
						{(viewMode === 'login'
							? <FormattedMessage id="collections.newToPubPub" defaultMessage="No account? Click to Register"/>
							: <FormattedMessage id="collections.alreadyHaveAccount" defaultMessage="Already have an account? Click to Login"/>
						)}
					</div>


					<div style={[styles.form, this.props.loginData.get('isVisible') && styles[viewMode].login, ]}>
						<LoginForm onSubmit={this.handleLoginSubmit} toggleVisibility={this.toggleLogin}/>
					</div>

					<div style={[styles.form, this.props.loginData.get('isVisible') && styles[viewMode].register]}>
						<LoginFormRegister onSubmit={this.handleLoginRegisterSubmit} onFileSelect={this.handleFileSelect} userImage={this.state.userImageURL}/>
					</div>

				</div>
				
				<div style={[styles.imageCropperWrapper, this.state.userImageFile !== null && styles.imageCropperWrapperVisible]} >
					<ImageCropper height={150} width={150} image={this.state.userImageFile} onCancel={this.cancelImageUpload} onUpload={this.userImageUploaded}/>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(Login) );

styles = {
	cancel: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 140,
		height: 40,
		// backgroundColor: 'rgba(50,100,0,1)',
		color: globalStyles.headerText,
		textAlign: 'right',
		padding: 20,
		fontSize: '25px',
		cursor: 'pointer',
		':hover': {
			color: globalStyles.headerHover
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'relative',
			width: 'calc(100% - 40px)',
			top: 0,
			left: 0,
			right: 'auto',
			bottom: 'auto',
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 40px)',
		},

	},
	loaderContainer: {
		position: 'absolute',
		width: '100%',
		height: 1,
		top: 15,
		// backgroundColor: 'red',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			top: globalStyles.headerHeightMobile,
		},
	},
	formWrapper: {
		// backgroundColor: 'rgba(200,0,0,0.3)',
		width: 800,
		height: 360,
		position: 'absolute',
		top: '50%',
		left: '50%',
		margin: '-200px 0 0 -400px',
		transition: '.2s linear transform',
		transform: 'scale(0.8)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			position: 'relative',
			margin: 0,
			padding: 0,
			top: 0,
			left: 0,

		},
	},
	formWrapperVisible: {
		transform: 'scale(1.0)',
	},
	title: {
		height: 60,
		width: 260,
		float: 'left',
		// backgroundColor: 'rgba(200,100,0,0.5)',
		textTransform: 'capitalize',
		color: globalStyles.headerText,
		padding: '0px 20px',
		lineHeight: '60px',
		fontSize: '55px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
			float: 'none',
		},
	},
	viewModeToggle: {
		height: 20,
		width: 260,
		margin: '0px 0px 0px 200px',
		float: 'left',
		// backgroundColor: 'rgba(50,100,0,0.5)',
		color: globalStyles.headerText,
		padding: 20,
		lineHeight: '50px',
		textAlign: 'right',
		fontSize: '15px',
		cursor: 'pointer',
		':hover': {
			color: globalStyles.headerHover
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 20px)',
			float: 'none',
			padding: '0px 20px 0px 0px',
			height: 40,
			lineHeight: '40px',
			margin: 0,

		},
	},
	errorMessage: {
		width: 'calc(100% - 60px)',
		// backgroundColor: 'rgba(50,100,0,0.2)',
		position: 'absolute',
		padding: 30,
		fontSize: '18px',
		color: '#FF6161',
		top: 60,
		left: 0,
		pointerEvents: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			top: 250,
		},
	},
	form: {
		position: 'absolute',
		// backgroundColor: 'rgba(50,100,150,.5)',
		top: 60,
		left: 0,
		width: 800,
		height: 300,
		opacity: 0,
		pointerEvents: 'none',
		// transition: '.1s linear opacity',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			top: 100,
			left: 0,
			width: '100%',
			height: 'auto',
		},
	},
	login: {
		login: {
			opacity: 1,
			pointerEvents: 'auto',
		}
	},
	register: {
		register: {
			opacity: 1,
			pointerEvents: 'auto',
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
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: 1000,
		overflow: 'hidden',
		fontFamily: globalStyles.headerFont,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			overflow: 'scroll',
		},
	},
	text: {
		color: 'white',
		textAlign: 'center',
		fontFamily: globalStyles.headerFont
	},
	userImageUpload: {
		margin: '90px 30px 0px 30px',
		fontSize: '25px',
		color: globalStyles.headerText,
		backgroundColor: 'red',
	},
	imageCropperWrapper: {
		height: '270px',
		width: '450px',
		backgroundColor: 'rgba(255,255,255,0.97)',
		position: 'fixed',
		top: 0,
		left: 'calc(50% - 250px)',
		opacity: 0,
		pointerEvents: 'none',
		transition: '.1s linear opacity',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			height: 'auto',
			left: 0,
		},
	},
	imageCropperWrapperVisible: {
		opacity: 1,
		pointerEvents: 'auto',
	},


};
