import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {NotFound} from '../../containers';
import {submitResetRequest} from '../../actions/resetPassword';
import {globalStyles} from '../../utils/styleConstants';

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const ResetPassword = React.createClass({
	propTypes: {
		resetData: PropTypes.object,
		hash: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	resetRequestSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(submitResetRequest(this.refs.requestResetEmail.value));
	},

	render: function() {

		const metaData = {
			title: 'Password Reset',
		};

		return (

			<div style={styles.container}>

				<Helmet {...metaData} />

				<div style={styles.header}>Password Reset</div>
				<div style={styles.content}>
					{this.props.resetData.loading
						? 'LOADING'
						: ''
					}
					{this.props.hash
						? <div>
							{()=>{
								switch (this.props.resetData.get('resetSuccess')) {
								case 'success': 
									return 'reset is a success, login';
								case 'invalid':
									return <NotFound />;
								case 'valid': 
									return 'enter new password';
								default:
									return <NotFound />;
								}
							}()}
						</div>
						: <div>
							{()=>{
								switch (this.props.resetData.get('requestSuccess')) {
								case 'success': 
									return 'requested - check your email';
								case 'error':
									return 'No user with that email';
								default:
									return (<div>
										<div>Please enter the email address of your PubPub account.</div>
										<div>Reset instructions will be sent to this email.</div>
										<form onSubmit={this.resetRequestSubmit}>
											<input type="email" ref={'requestResetEmail'}/>
											<div onClick={this.resetRequestSubmit}>Reset</div>
										</form>
									</div>);
								}
							}()}
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
		maxWidth: 1024,
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
};
