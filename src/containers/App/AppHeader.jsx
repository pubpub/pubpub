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
						<div style={[styles.headerButton, styles.headerNavItem]}>
							<FormattedMessage {...globalMessages.login} />
						</div>
					</Link>
				}

				{/* Account Button */}
				{isLoggedIn && // Render if logged in
					<div style={[styles.headerButton, styles.headerNavItem]} onClick={this.toggleAccountMenu}>
						<img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'thumbnail'])} />
					</div>
				}

				{/* Notication Count Button */}
				{isLoggedIn && !!this.props.loginData.getIn(['userData', 'notificationCount']) && // Render if logged in and has notification count
					<Link to={'/user/' + this.props.loginData.getIn(['userData', 'username']) + '/notifications'}>
						<div className={'lightest-bg darkest-color'} style={styles.notificationBlock}>
							{this.props.loginData.getIn(['userData', 'notificationCount'])}
						</div>
					</Link>
				}
				
				{/* Account Menu */}
				{this.state.accountMenuOpen && // Render if the account menu is set open
					<div className="header-menu darker-bg" style={styles.headerMenu}>
						<ul>
							<li>Cats</li>
							<li>Dogs</li>
							<li>Turtles</li>
						</ul>
					</div>
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
		lineHeight: 'calc(' + globalStyles.headerHeight + ' + 2px)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
		}
	},
	headerLogo: {
		fontSize: '1.4em',
		transform: 'translateY(2px)', // The logo looks like it is set a bit too high by default
	},
	headerNavItem: {
		fontSize: '0.9em',
		float: 'right',
		cursor: 'pointer'
	},
	userImage: {
		height: 22,
		width: 22,
		padding: 9,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 40,
			width: 40,
			padding: 20,
		}
	},
	notificationBlock: {
		display: 'inline-block',
		float: 'right',
		fontSize: '0.9em',
		height: 18,
		lineHeight: '18px',
		padding: '0px 5px',
		margin: '11px 0px',
		textAlign: 'center',
		borderRadius: '1px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	headerMenu: {
		overflow: 'hidden',
		position: 'absolute',
		width: '250px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'relative',
			width: 'auto',
		}
	},
};
