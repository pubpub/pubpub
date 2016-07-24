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
		path: PropTypes.string, 
		createDocument: PropTypes.func,
		logoutHandler: PropTypes.func,
	},

	getInitialState() {
		return {
			accountMenuOpen: false
		};
	},

	componentWillReceiveProps(nextProps) {
		// If the path changes, close the menu
		if (this.props.path !== nextProps.path) {
			this.setState({accountMenuOpen: false});
		}
	},

	toggleAccountMenu: function() {
		this.setState({accountMenuOpen: !this.state.accountMenuOpen});
	},

	logout: function() {
		this.toggleAccountMenu();
		this.props.logoutHandler();
	},

	render: function() {
		const isLoggedIn = this.props.loginData && this.props.loginData.get('loggedIn');
		const name = this.props.loginData && this.props.loginData.getIn(['userData', 'name']);
		const username = this.props.loginData && this.props.loginData.getIn(['userData', 'username']);
		const loginQuery = this.props.path && this.props.path !== '/' ? '?redirect=' + this.props.path : ''; // Query appended to login route. Used to redirect to a given page after succesful login.

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
					<Link to={'/login' + loginQuery} style={globalStyles.link}>
						<div style={[styles.headerButton, styles.headerNavItem]}>
							<FormattedMessage {...globalMessages.login} />
						</div>
					</Link>
				}

				{/* Account Button */}
				{isLoggedIn && // Render if logged in
					<div style={[styles.headerButton, styles.headerNavItem]} onClick={this.toggleAccountMenu}>
						<img style={styles.userImage} src={'https://jake.pubpub.org/unsafe/50x50/' + this.props.loginData.getIn(['userData', 'image'])} />
					</div>
				}

				{/* Notication Count Button */}
				{isLoggedIn && !!this.props.loginData.getIn(['userData', 'notificationCount']) && // Render if logged in and has notification count
					<Link to={'/user/' + username + '/notifications'}>
						<div className={'lightest-bg darkest-color'} style={styles.notificationBlock}>
							{this.props.loginData.getIn(['userData', 'notificationCount'])}
						</div>
					</Link>
				}
				
				{/* Account Menu Splash*/}
				{this.state.accountMenuOpen && // Render if the account menu is set open
					<div className={'header-menu-splash'} style={styles.headerMenuSplash} onClick={this.toggleAccountMenu}></div>
				}

				{/* Account Menu */}
				{/* Use CSS to toggle display:none, to avoid flicker on mobile */}
				<div className="header-menu lightest-bg darkest-color arrow-box" style={[styles.headerMenu, !this.state.accountMenuOpen && {display: 'none'}]}>
					<Link className={'menu-option'} to={'/user/' + username}>{name}</Link>

					<div className={'menu-separator'} ></div>

					<div className={'menu-option'} onClick={this.props.createDocument}>New Document</div>
					<Link className={'menu-option'} to={'/user/' + username + '/journals'}>My Journals</Link>
					
					<div className={'menu-separator'} ></div>

					<Link className={'menu-option'} to={'/settings'}>Settings</Link>
					<div className={'menu-option'} onClick={this.logout}>Logout</div>
				</div>

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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '1em',
		}
	},
	headerNavItem: {
		fontSize: '0.9em',
		float: 'right',
		cursor: 'pointer',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '0.6em',
		}
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
	headerMenuSplash: {
		position: 'fixed',
		width: '100vw',
		height: '100vh',
		top: 0,
		zIndex: 99999998,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	headerMenu: {
		position: 'absolute',
		width: '175px',
		boxShadow: '0px 0px 2px #808284',
		border: '1px solid #808284',
		borderRadius: '1px',
		right: 5,
		top: 45,
		padding: '.2em 0em',
		zIndex: 99999999,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'static',
			width: 'auto',
			boxShadow: 'inset 0px -4px 4px -2px #BBBDC0',
			border: '0px solid transparent',
			fontSize: '0.6em',
		}
	},
	menuName: {
		padding: '.2em 2em .2em 1em',
	}
};
