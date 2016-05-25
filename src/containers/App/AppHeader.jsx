import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const AppHeader = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
	},

	getInitialState() {
		return {
			accountMenuOpen: false
		};
	},

	toggleAccountMenu: function() {
		this.setState({accountMenuOpen: !this.state.accountMenuOpen});
	},

	render: function() {
		const isLoggedIn = this.props.loginData && this.props.loginData.get('loggedIn');

		return (
			<div className="header-bar darkest-bg lightest-color" style={styles.headerBar}>

				{/* PubPub Logo */}
				<Link to={'/'} style={globalStyles.link}>
					<div className="header-logo title-font" key="headerLogo" style={[styles.headerButton, styles.headerLogo]}>
						PubPub
					</div>
				</Link>

				{/* Login Button */}
				{!isLoggedIn && // Render if not logged in
					<Link to={'/login'} style={globalStyles.link}>
						<div style={[styles.headerButton, styles.headerNav]}>
							<FormattedMessage {...globalMessages.login} />
						</div>
					</Link>
				}

				{/* Account Button */}
				{isLoggedIn && // Render if logged in
					<div style={[styles.headerButton, styles.headerNav]} onClick={this.toggleAccountMenu}>

						<img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'thumbnail'])} />
						<div style={[styles.userName]}>
							<FormattedMessage {...globalMessages.account} />
						</div>

					</div>
				}

				{/* Notication Count Button */}
				{isLoggedIn && this.props.loginData.getIn(['userData', 'notificationCount']) && // Render if logged in and has notification count
					<Link to={'/user/' + this.props.loginData.getIn(['userData', 'username']) + '/notifications'}>
						<div style={[styles.headerButton, styles.headerNav]}>
							<div key="headerNavNotifications" style={styles.notificationBlock}>
								{this.props.loginData.getIn(['userData', 'notificationCount'])}
							</div>
						</div>
					</Link>
				}			
				
				{/* Account Menu */}
				{this.state.accountMenuOpen && // Render if the account menu is set open
					<div className="header-menu">CAT</div>
				}

			</div>
			
		);
	}
});

export default Radium(AppHeader);

styles = {
	headerBar: {
		fontSize: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '2em',
		},
	},

	headerButton: {
		padding: '0px 15px',
		display: 'inline-block',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
		}
	},
	headerLogo: {
		fontSize: '1.4em',
		transform: 'translateY(2px)', // The logo looks like it is set a bit too high by default
	},
	
	headerNav: {
		fontSize: '0.9em',
		float: 'right',
	},

	// navButton: {
	// 	float: 'right',
	// 	height: globalStyles.headerHeight,
	// 	lineHeight: globalStyles.headerHeight,
	// 	fontFamily: globalStyles.headerFont,
	// 	padding: '0px 15px',
	// 	':hover': {
	// 		cursor: 'pointer',
	// 	}
	// },
	// accountSpanWithNotification: {
	// 	padding: '0px 5px 0px 15px',
	// },
	notificationBlock: {
		height: '18px',
		lineHeight: '16px',
		padding: '0px 5px',
		margin: '6px 6px 6px -0px',
		textAlign: 'center',
		borderRadius: '1px',
	},
	// separator: {
	// 	width: 1,
	// 	backgroundColor: '#999',
	// 	height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
	// 	margin: '8px 0px',
	// 	float: 'right',
	// },

	userImage: {
		height: 18,
		width: 18,
		padding: 6,
		float: 'right',
	},
	userName: {
		float: 'right',
		padding: '0px 3px 0px 0px',
	},
};
