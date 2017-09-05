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
			<div className={'login'}>
				<Helmet>
					<title>Login</title>
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<div className={'pt-card pt-elevation-2'} style={{ maxWidth: '550px', margin: '0 auto' }}>
								<h1>Login</h1>
								<p>{this.props.appData.title} is powered by PubPub.</p>
								<p>Use your PubPub login</p>
							</div>
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

// fetch('http://localhost:9876/login', {
// 	method: 'POST',
// 	credentials: 'include',
// 	headers: {
// 		Accept: 'application/json',
// 		'Content-Type': 'application/json'
// 	},
// 	body: JSON.stringify({
// 		password: 'password',
// 		email: '1858ashton51@yahoo.com'
// 	})
// });
