import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import { getSignUpData } from './actions';

let styles;

export const CreateAccount = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	statics: {
		readyOnActions: function(dispatch, params) {
			return Promise.all([
				dispatch(getSignUpData(params.hash))
			]);
		}
	},

	getInitialState() {
		return {
			email: '',
		};
	},


	render() {
		const accountData = this.props.accountData || {};
		const user = accountData.user || {};
		return (
			<div style={styles.container}>
				{accountData.error &&
					<div>
						<h1>Invalid Hash</h1>
						This account has either already been created or the hash is invalid
						<p>To signup please begin at <Link to={'/signup'}>Sign Up</Link></p>
					</div>
				}
				
				{accountData.loading &&
					<div>Loading</div>
				}
				
				{user.email &&
					<div style={[styles.container1, styles.container2]}>
						<h1>Welcome!</h1>
						<p>Hello there, {user.email}</p>
					</div>
				}

			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		accountData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(CreateAccount));

styles = {
	container: {
		padding: '1em'
	},
	container1: {
		color: 'red',
	},
	container2: {
		backgroundColor: 'green',
		userSelect: 'none',
		// transform: 'rotate(10deg)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			color: 'orange',
		}
	}
};
