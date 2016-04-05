import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';

import {checkHash, resetPassword, submitResetRequest} from './actions';
import {toggleVisibility} from 'containers/Login/actions';
import {globalStyles} from 'utils/styleConstants';

import {LoaderIndeterminate, NotFound} from 'components';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const ResetPassword = React.createClass({
	propTypes: {
		resetData: PropTypes.object,
		hash: PropTypes.string,
		username: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			if (routeParams.hash) {
				return dispatch(checkHash(routeParams.hash, routeParams.username));
			}
			return ()=>{};
		}
	},

	resetRequestSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(submitResetRequest(this.refs.requestResetEmail.value));
	},

	resetPasswordSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(resetPassword(this.props.hash, this.props.username, this.refs.resetPassword.value));
	},

	toggleLogin: function() {
		this.props.dispatch(toggleVisibility());
	},

	render: function() {

		const metaData = {
			title: 'Password Reset',
		};

		return (

			<div style={styles.container}>

				<Helmet {...metaData} />

				{this.props.hash && this.props.resetData.get('resetSuccess') === 'invalid'
					? null
					: <div style={styles.header}>Password Reset</div>
				}

				<div style={styles.content}>

					<div style={styles.loaderWrapper}>
						{this.props.resetData.get('loading')
							? <LoaderIndeterminate color={globalStyles.sideText}/>
							: null
						}
					</div>

					{this.props.hash
						? <div>
							{(()=>{
								switch (this.props.resetData.get('resetSuccess')) {
								case 'success':
									return (
										<div>
											<div style={styles.detail}>Password Reset successful!</div>
											<div style={styles.loginButton} key={'resetLoginButton'} onClick={this.toggleLogin}>Click to Login</div>
										</div>
									);
								case 'invalid':
									return <NotFound />;
								case 'valid':
									return (
										<form onSubmit={this.resetPasswordSubmit}>
											<input style={styles.input} type="password" ref={'resetPassword'} placeholder={'new password'}/>
											<div style={styles.submitButton} key={'passwordResetButton'} onClick={this.resetPasswordSubmit}>Set New Password</div>
										</form>
									);
								default:
									return <NotFound />;
								}
							})()}
						</div>
						: <div>
							{(()=>{
								switch (this.props.resetData.get('requestSuccess')) {
								case 'success':
									return (
										<div>
											<div style={styles.detail}>Password Reset Request Submitted.</div>
											<div style={styles.detail}>Check your email.</div>
										</div>
									);
								default:
									return (<div>
										<div style={styles.detail}>Please enter the email address of your PubPub account.</div>
										<div style={styles.detail}>Reset instructions will be sent to this email.</div>
										<form onSubmit={this.resetRequestSubmit}>
											<input style={styles.input} type="email" ref={'requestResetEmail'} placeholder={'email'}/>
											<div style={styles.submitButton} key={'resetRequestButton'} onClick={this.resetRequestSubmit}>Reset</div>
										</form>
										{this.props.resetData.get('requestSuccess') === 'error'
											? <div style={styles.error}>No user with that email</div>
											: null
										}
									</div>);
								}
							})()}
						</div>
					}
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		resetData: state.resetPassword,
		hash: state.router.params.hash,
		username: state.router.params.username,
	};
})( Radium(ResetPassword) );

styles = {
	container: {
		fontFamily: globalStyles.headerFont,
		position: 'relative',
		maxWidth: 800,
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
			padding: '0px 20px',
			maxWidth: '100%',
		},
	},
	header: {
		color: globalStyles.sideText,
		padding: '20px 0px',
		fontSize: '50px',
	},
	content: {
		padding: '0px 20px',
	},
	loaderWrapper: {
		position: 'absolute',
		top: '15px',
		width: '100%',
	},
	detail: {
		fontSize: '18px',
	},
	input: {
		display: 'block',
		margin: '15px 0px',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#aaa',
		backgroundColor: 'transparent',
		fontSize: '25px',
		width: '60%',
		color: '#555',
		':focus': {
			borderWidth: '0px 0px 1px 0px',
			borderColor: 'black',
			outline: 'none',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
		},
	},
	submitButton: {
		fontSize: 30,
		padding: '0px 20px',
		float: 'right',
		marginBottom: 20,
		fontFamily: globalStyles.headerFont,
		cursor: 'pointer',
		color: '#555',
		':hover': {
			color: 'black',
		}
	},
	loginButton: {
		width: '250px',
		fontSize: '20px',
		textAlign: 'center',
		margin: '20px auto',
		border: '1px solid #ccc',
		cursor: 'pointer',
		borderRadius: '1px',
		padding: '15px 0px',
		color: '#555',
		':hover': {
			color: '#000',
		},
	},
	error: {
		color: 'red',
	},
};
