import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const HeaderNav = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		navData: PropTypes.object,
		color: PropTypes.string,
		hoverColor: PropTypes.string,
		loginToggle: PropTypes.func
	},

	headerTextColorStyle: function() {
		return {
			color: this.props.color,
			':hover': {
				color: this.props.hoverColor,
			}
		};
	},

	render: function() {
		const isLoggedIn = this.props.loginData.get('loggedIn');

		return (
			<div styles={styles.right}>

				<div key="headerNavLogin" onClick={this.props.loginToggle} style={[styles.navButton, this.headerTextColorStyle()]}>
					
					{/* If Logged Out */}
					{/* ------------- */}
					<span style={styles.loggedOut[isLoggedIn]}>
						Login
					</span>

					{/* If Logged In */}
					{/* ------------ */}
					<span key="headerLogin" style={[styles.loggedIn[isLoggedIn]]}>
						
						<img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'thumbnail'])} />
						{/* <div style={styles.userName}>{this.props.loginData.getIn(['userData', 'name'])}</div> */}
						<div style={styles.userName}>Account</div>
					
					</span>

				</div>

				{
					this.props.loginData.get('loggedIn') === true
						? 	<div>
								<div style={styles.separator}></div>
								<Link to={'/newpub'}><div key="headerNavNewPub" style={[styles.navButton, this.headerTextColorStyle()]}>New Pub</div></Link>
							</div>
						: null
				}
				

			</div>
		);
	}
});

export default Radium(HeaderNav);

styles = {
	right: {
		float: 'right',
	},
	navButton: {
		float: 'right',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		fontFamily: globalStyles.headerFont,
		padding: '0px 15px',
		':hover': {
			cursor: 'pointer',
		}
	},
	separator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
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
		width: 18,
		padding: 6,
		float: 'right',
	},
	userName: {
		float: 'right',
		padding: '0px 3px 0px 0px'
	},
};

// {( this.props.loginData.get('loggedIn') === false
// 	? <span>Login</span>
// 	: ( <div>
// 			<img src={this.props.loginData.getIn(['userData', 'image'])} /> 
// 			{this.props.loginData.getIn(['userData', 'name'])}
// 		</div>)
// )}
