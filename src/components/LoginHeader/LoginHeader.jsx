import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const LoginHeader = React.createClass({
	propTypes: {
		loginData: PropTypes.object
	},

	render: function() {
		const isLoggedIn = this.props.loginData.get('loggedIn');

		return (
			<div>

				{/* If Logged Out */}
				{/* ------------- */}
				<div style={styles.loggedOut[isLoggedIn]}>
					Login
				</div>

				{/* If Logged In */}
				{/* ------------- */}
				<div style={styles.loggedIn[isLoggedIn]}>
					<div style={styles.userName}>{this.props.loginData.getIn(['userData', 'name'])}</div>
					<img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'image'])} /> 
					
				</div>

			</div>
		);
	}
});

export default Radium(LoginHeader);

styles = {
	loggedOut: {
		true: {
			display: 'none',
		}
	},
	loggedIn: {
		false: {
			display: 'none',
		}
	},
	userImage: {
		height: 24,
		padding: 3,
		float: 'right'
	},
	userName: {
		float: 'right',
		padding: '0px 10px'

	}

};

// {( this.props.loginData.get('loggedIn') === false
// 	? <span>Login</span>
// 	: ( <div>
// 			<img src={this.props.loginData.getIn(['userData', 'image'])} /> 
// 			{this.props.loginData.getIn(['userData', 'name'])}
// 		</div>)
// )}
