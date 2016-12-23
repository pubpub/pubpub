import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import Radium from 'radium';
import Helmet from 'react-helmet';


import { Loader } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { checkHash } from './actions';

import { NonIdealState } from '@blueprintjs/core';


let styles = {};

export const ChangePassword = React.createClass({
	propTypes: {
		changePasswordData: PropTypes.object,
		dispatch: PropTypes.func,
		hash: PropTypes.string
	},

	getInitialState() {
		return {
			email: '',
			showConfirmation: false
		};
	},

	componentWillReceiveProps(nextProps) {
		// If login was succesful, redirect
		const oldLoading = this.props.changePasswordData.resetPasswordLoading;
		const nextLoading = nextProps.changePasswordData.resetPasswordLoading;
		const nextError = nextProps.changePasswordData.resetPasswordError;

		if (oldLoading && !nextLoading && !nextError) {
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase() });
	},

	handleChangePasswordSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(checkHash(this.state.hash));
	},

	render: function() {
		const changePasswordData = this.props.changePasswordData || {};
		const isLoading = changePasswordData.loading;
		const error = changePasswordData.resetPasswordError;

		const showConfirmation = this.state.showConfirmation;

		console.log("CHANGE PASSWORD")
		return (
			<div style={styles.container}>
				<Helmet title={'Reset Password · PubPub'} />

				<h1><FormattedMessage {...globalMessages.ChangePassword} /></h1>

				{ error &&
					<div style={styles.errorMessage}>
						<FormattedMessage id="resetPassword.InvalidHash" defaultMessage="Invalid Hash" />
					</div>
				}

				{ !error &&
						<NonIdealState
							description={'Your password has been successfully changed'}
							title={'Password Reset'}
							visual={'Tick'} />
				}

			</div>
		);
	}

});


function mapStateToProps(state) {
	return {
		changePasswordData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(ChangePassword));

styles = {
	container: {
		width: '500px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		margin: '1em 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		display: 'block',
		margin: '1em 0em',
	},

};
