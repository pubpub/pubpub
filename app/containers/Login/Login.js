import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const propTypes = {
	appData: PropTypes.object.isRequired,
};

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
		};
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
							<p>{this.props.appData.title} is powered by PubPub.</p>
							<p>Use your PubPub login</p>
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
export default withRouter(connect(state => ({
	appData: state.app
}))(Login));
