import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {login} from './actions';
import {Link} from 'react-router';
import {Loader} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const SignUpFollow = React.createClass({
	propTypes: {
		signUpSubmitHandler: PropTypes.func,
	},

	signUpSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(login(this.refs.loginEmail.value, this.refs.loginPassword.value));
	},

	componentWillReceiveProps(nextProps) {
		// If there is a new username in loginData, login was a sucess, so redirect
		const oldUsername = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
		const newUsername = nextProps.loginData && nextProps.loginData.getIn(['userData', 'username']);
		if (newUsername && oldUsername !== newUsername) {
			const userProfile = '/user/' + newUsername;
			const redirectQuery = this.props.query && this.props.query.redirect;
			this.props.dispatch(pushState(null, (redirectQuery || userProfile)));
		}
	},

	render: function() {
		const metaData = {
			title: 'PubPub | Follow',
		};
		const isLoading = this.props.loginData && this.props.loginData.get('loading');
		const errorMessage = this.props.loginData && this.props.loginData.get('error');

		return (
			<div className={'signup-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1><FormattedMessage {...globalMessages.SignUp}/></h1>
				<p style={styles.subHeader}>Follow people and journals to stay up to date with the communities you care about.</p>
				<p>Follow 5 or more to continue</p>
				
				
			</div>
		);
	}

});

export default Radium(SignUpFollow);

styles = {
	container: {
		width: '500px',
		padding: '0px 15px',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)',
		}
	},
	subHeader: {  
		margin: '-20px 0px 20px 0px',
		fontSize: '0.9em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		...globalStyles.link,
		display: 'block',
		margin: '3em 0em'
	}
};
