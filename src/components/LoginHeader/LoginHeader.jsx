import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LoginHeader = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		clickFunction: PropTypes.func
	},

	render: function() {
		const isLoggedIn = this.props.loginData.get('loggedIn');

		return (
			<div onClick={this.props.clickFunction} styles={styles.right}>

				{/* If Logged Out */}
				{/* ------------- */}
				<div style={[styles.loggedOut[isLoggedIn], styles.userName, styles.headerText]}>
					Login
				</div>

				{/* If Logged In */}
				{/* ------------- */}
				<div key="headerLogin" style={[styles.loggedIn[isLoggedIn], styles.headerText]}>
					
					{/* <img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'image'])} /> */}
					<img style={styles.userImage} src="http://blog.boostability.com/wp-content/uploads/2014/09/Panda-Update.jpg" />
					<div style={styles.userName}>{this.props.loginData.getIn(['userData', 'name'])}</div>
					
				</div>

			</div>
		);
	}
});

export default Radium(LoginHeader);

styles = {
	right: {
		float: 'right',
	},
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
		height: 18,
		padding: 6,
		float: 'right'
	},
	userName: {
		float: 'right',
		padding: '0px 3px 0px 10px'
	},
	headerText: {
		lineHeight: globalStyles.headerHeight,
		color: globalStyles.headerText,
		padding: '0px 6px 0px 10px',
		textDecoration: 'none',
		':hover': {
			color: globalStyles.headerHover,
			cursor: 'pointer'
		},
		fontFamily: globalStyles.headerFont,
	},

};

// {( this.props.loginData.get('loggedIn') === false
// 	? <span>Login</span>
// 	: ( <div>
// 			<img src={this.props.loginData.getIn(['userData', 'image'])} /> 
// 			{this.props.loginData.getIn(['userData', 'name'])}
// 		</div>)
// )}
