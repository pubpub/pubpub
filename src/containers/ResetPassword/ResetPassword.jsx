import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';

import {checkHash, resetPassword, submitResetRequest} from './actions';
import {toggleVisibility} from 'containers/Login/actions';
import {globalStyles} from 'utils/styleConstants';

import {Loader, NotFound} from 'components';

import {safeGetInToJS} from 'utils/safeParse';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const ResetPassword = React.createClass({
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
		const resetSuccess = safeGetInToJS(this.props.resetData, ['resetSuccess']);
		const requestSuccess = safeGetInToJS(this.props.resetData, ['requestSuccess']);
		const loading = safeGetInToJS(this.props.resetData, ['loading']);

		const metaData = {
			title: 'Password Reset',
		};

		return (

			<div style={styles.container} className={'section'}>

				<Helmet {...metaData} />

				{this.props.hash && resetSuccess === 'invalid'
					? null
					: <h1>Password Reset</h1>
				}
				<div style={styles.content}>

					{this.props.hash
						? <div>
							{(()=>{
								switch (resetSuccess) {
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
											<div>
												<label style={styles.label} htmlFor={'newPassword'}>
													New Password
												</label>
												<input ref={'newPassword'} id={'newPassword'} name={'New Password'} type="password" style={styles.input}/>
											</div>

											<button name={'login'} className={'button'} onClick={this.resetPasswordSubmit}>Set New Password</button>
											<div style={styles.loaderContainer}><Loader loading={loading} showCompletion={false}/></div>
										</form>
									);
								default:
									return <NotFound />;
								}
							})()}
						</div>
						: <div>
							{(()=>{
								switch (requestSuccess) {
								case 'success':
									return (
										<div>
											<p style={styles.detail}>Password Reset Request Submitted.</p>
											<p style={styles.detail}>Check your email.</p>
										</div>
									);
								default:
									return (<div>
										<p style={styles.detail}>Please enter the email address of your PubPub account.</p>
										<p style={styles.detail}>Reset instructions will be sent to this email.</p>

										<form onSubmit={this.resetRequestSubmit}>
											<div>
												<label style={styles.label} htmlFor={'email'}>
													Email
												</label>
												<input ref={'email'} id={'email'} name={'email'} type="text" style={styles.input}/>
											</div>

											<button name={'login'} className={'button'} onClick={this.resetRequestSubmit}>Reset Password</button>
											<div style={styles.loaderContainer}><Loader loading={loading} showCompletion={false}/></div>
										</form>
										{requestSuccess === 'error'
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
		// fontFamily: globalStyles.headerFont,
		// position: 'relative',
		maxWidth: 800,
		// margin: '0 auto',
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	width: 'calc(100% - 40px)',
		// 	padding: '0px 20px',
		// 	maxWidth: '100%',
		// },
	},
	// header: {
	// 	color: globalStyles.sideText,
	// 	padding: '20px 0px',
	// 	fontSize: '50px',
	// },
	// content: {
	// 	padding: '0px 20px',
	// },
	loaderWrapper: {
		position: 'absolute',
		top: '15px',
		width: '100%',
	},
	detail: {
		fontSize: '18px',
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
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
