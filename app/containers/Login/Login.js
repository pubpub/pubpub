import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class Login extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>Login</title>
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>

							<h1>Login</h1>
							{/*
								Pub Header
								Pub Contributors
								Pub Content
								Pub License
							*/}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(Login));
