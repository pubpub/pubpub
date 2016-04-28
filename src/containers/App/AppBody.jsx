import React, { PropTypes } from 'react';
import Radium, {Style} from 'radium';
import { Link } from 'react-router';
import {reset} from 'redux-form';
import HeaderNav from './AppBodyHeaderNav';
import HeaderMenu from './AppBodyHeaderMenu';
import {Login} from 'containers';
import {loadAppAndLogin, openMenu, closeMenu} from './actions';
import {toggleVisibility, follow, unfollow} from 'containers/Login/actions';
import {openPubModal} from 'containers/PubReader/actions';

import {globalStyles} from 'utils/styleConstants';
import analytics from 'utils/analytics';

let styles = {};

const AppBody = React.createClass({
	propTypes: {
		appData: PropTypes.object,
		loginData: PropTypes.object,
		pubData: PropTypes.object,
		path: PropTypes.string,
		slug: PropTypes.string,
		children: PropTypes.object.isRequired,
		dispatch: PropTypes.func
	},

	componentWillReceiveProps: function(nextProps) {
		// Close the menu if we're changing routes and it's open
		if (this.props.path !== nextProps.path && nextProps.appData.get('menuOpen')) {
			this.props.dispatch(closeMenu());
		}
		if (this.props.path !== nextProps.path) {
			analytics.pageView(nextProps.path, nextProps.loginData.get('loggedIn'));
		}

	},

	componentDidMount() {
		analytics.pageView(this.props.path, this.props.loginData.get('loggedIn'));

		if (!this.props.loginData.get('loggedIn') && this.props.appData.get('baseSubdomain') !== null) {
			// If we're not logged in, and on a journal domain (i.e. not www.pubpub.org)...
			this.testAndRestoreLogin();
		}
	},

	testAndRestoreLogin: function() {
		// If the user is not logged in. We
		// 1) Create a listener that will listen to postMessage calls
		// 2) Create an iframe to pubpub.org to check for a login cookie
		// 3) On the backend, check to verify that the given domain requesting the login cookie is within our system of journalSubdomain
		// 4) On verification of referring domain, send down iframe content that will read the cookies and post a message with the login cookie (if available)
		// A larger scale implementation of a similar approach described by Stack Overflow here: http://meta.stackexchange.com/questions/64260/how-does-sos-new-auto-login-feature-work
		// About window.postMessage: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

		// Create the Listener
		window.addEventListener( 'message', (evt)=> {
			if (evt.origin !== 'http://www.pubpub.org') { return; } // Only listen to iFrame messages from pubpub.org
			if (evt.data) {
				document.cookie = evt.data;
				this.props.dispatch(loadAppAndLogin());
			}
		}, false);

		// Create the iFrame
		const iframe = document.createElement('iframe');
		iframe.src = 'http://www.pubpub.org/api/testLogin';
		iframe.style.cssText = 'opacity:0;position:absolute;border:0;height:0;width:0;';
		document.body.appendChild(iframe);
	},

	toggleLogin: function() {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
			this.props.dispatch(reset('loginForm'));
			this.props.dispatch(reset('loginFormRegister'));
		}
	},

	closeMenu: function() {
		this.props.dispatch(closeMenu());
	},

	openMenu: function() {
		this.props.dispatch(openMenu());
	},
	openPubModal: function(modal) {
		return ()=> {
			this.props.dispatch(openPubModal(modal));
		};
	},

	followPubToggle: function() {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		const analyticsData = {
			type: 'pubs',
			followedID: this.props.pubData.getIn(['pubData', '_id']),
			pubtitle: this.props.pubData.getIn(['pubData', 'title']),
			numFollowers: this.props.pubData.getIn(['pubData', 'followers']) ? this.props.pubData.getIn(['pubData', 'followers']).size : 0,
		};

		const isFollowing = this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.pubData.getIn(['pubData', '_id'])) > -1 : false;
		if (isFollowing) {
			this.props.dispatch( unfollow('pubs', this.props.pubData.getIn(['pubData', '_id']), analyticsData ));
		} else {
			this.props.dispatch( follow('pubs', this.props.pubData.getIn(['pubData', '_id']), analyticsData ));
		}
	},

	render: function() {
		let headerBackground = (this.props.appData.get('baseSubdomain') && this.props.appData.getIn(['journalData', 'design', 'headerBackground'])) || globalStyles.headerBackground;
		let headerTextColor = (this.props.appData.get('baseSubdomain') && this.props.appData.getIn(['journalData', 'design', 'headerText'])) || globalStyles.headerText;
		let headerTextColorHover = (this.props.appData.get('baseSubdomain') && this.props.appData.getIn(['journalData', 'design', 'headerHover'])) || globalStyles.headerHover;
		if (this.props.path === '/') {
			headerBackground = (this.props.appData.get('baseSubdomain') && this.props.appData.getIn(['journalData', 'design', 'landingHeaderBackground'])) || globalStyles.headerText;
			headerTextColor = (this.props.appData.get('baseSubdomain') && this.props.appData.getIn(['journalData', 'design', 'landingHeaderText'])) || globalStyles.headerBackground;
			headerTextColorHover = (this.props.appData.get('baseSubdomain') && this.props.appData.getIn(['journalData', 'design', 'landingHeaderHover'])) || 'black';
		}

		const headerStyle = {
			headerText: {
				color: headerTextColor,
				':hover': {
					color: headerTextColorHover
				},
			},
			headerBar: {
				backgroundColor: headerBackground,
			},
		};

		const pubData = this.props.pubData.get('pubData').toJS ? this.props.pubData.get('pubData').toJS() : {};

		return (
			<div style={styles.body}>

				{
					// Set the body to not scroll if you have the login window or the mobile menu open
					this.props.loginData.get('isVisible') || this.props.appData.get('menuOpen') || (this.props.pubData.get('activeModal') !== undefined && this.props.path.indexOf('/pub/') > -1)
						? <Style rules={{'body': {overflow: 'hidden'}}} />
						: null
				}

				<div className="header-bar" style={[styles.headerBar, headerStyle.headerBar]}>

					<div key="headerLogo" style={[styles.headerLogo]}>
						<Link to={'/'} style={globalStyles.link}>
							<div style={[styles.headerText, styles.logoLink, headerStyle.headerText]}>
								{this.props.appData.get('baseSubdomain') !== null ? this.props.appData.getIn(['journalData', 'journalName']) : 'PubPub'}
							</div>
						</Link>
					</div>

					<div style={[styles.headerNavContainer]} >
						<div style={styles.headerMenu}>
							<HeaderMenu
								loginData={this.props.loginData}
								// appData={this.props.appData}
								color={headerTextColor}
								hoverColor={headerTextColorHover}
								loginToggle={this.toggleLogin}

								menuOpen={this.props.appData.get('menuOpen') ? true : false}
								openMenuHandler={this.openMenu}
								closeMenuHandler={this.closeMenu}
								openPubModalHandler={this.openPubModal}
								pubStatus={this.props.pubData.getIn(['pubData', 'status'])}
								followPubToggleHandler={this.followPubToggle}
								isFollowing={this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.pubData.getIn(['pubData', '_id'])) > -1 : false}
								journalCount={pubData.featuredInList ? pubData.featuredInList.length : 0}
								historyCount={pubData.history ? pubData.history.length : 0}
								analyticsCount={pubData.views ? pubData.views : 0}
								citationsCount={pubData.citations ? pubData.citations.length : 0}
								newsCount={pubData.news ? pubData.news.length : 0}

								isJournalAdmin={this.props.appData.getIn(['journalData', 'isAdmin'])}
								journalSubdomain={this.props.appData.get('baseSubdomain')}
								slug={this.props.slug}
								path={this.props.path}/>
						</div>

						<div style={styles.headerNav}>
							<HeaderNav
								loginData={this.props.loginData}
								backgroundColor={headerBackground}
								color={headerTextColor}
								hoverColor={headerTextColorHover}
								loginToggle={this.toggleLogin}
								isJournalAdmin={this.props.appData.getIn(['journalData', 'isAdmin'])}
								journalSubdomain={this.props.appData.get('baseSubdomain')} />
						</div>
					</div>

				</div>

				<Login />

				<div className="content" style={styles.content}>
					{this.props.children}
				</div>

				<div className="footer" style={[styles.footer, (this.props.path.substring(this.props.path.length - 6, this.props.path.length) === '/draft' || this.props.appData.get('baseSubdomain') !== null) && {display: 'none'} ]}>
					<div style={{display: 'table', margin: '0 auto'}}>
						<div style={styles.footerColumn}>
							<div style={styles.footerHeader}>PubPub</div>
							<Link style={globalStyles.link} to={'/pub/about'}><div style={styles.footerItem}>About</div></Link>
							<a style={globalStyles.link} href={'https://github.com/pubpub/pubpub'}><div style={styles.footerItem}>Code</div></a>
							<Link style={globalStyles.link} to={'/pub/jobs'}><div style={styles.footerItem}>Jobs</div></Link>

						</div>

						<div style={styles.footerColumn}>
							<div style={styles.footerHeader}>Explore</div>
							<Link style={globalStyles.link} to={'/pubs'}><div style={styles.footerItem}>Pubs</div></Link>
							<Link style={globalStyles.link} to={'/journals'}><div style={styles.footerItem}>Journals</div></Link>
							<Link style={globalStyles.link} to={'/pub/' + this.props.appData.getIn(['journalData', 'randomSlug'])}><div style={styles.footerItem}>Random Pub</div></Link>
						</div>

						<div style={styles.footerColumn}>
							<div style={styles.footerHeader}>Contact</div>
							<a style={globalStyles.link} href={'mailto:pubpub@media.mit.edu'}><div style={styles.footerItem}>Email</div></a>
							<a style={globalStyles.link} href={'https://twitter.com/pubpub'}><div style={styles.footerItem}>Twitter</div></a>
							<a style={globalStyles.link} href={'http://eepurl.com/bLkuVn'}><div style={styles.footerItem}>Mailing List</div></a>
						</div>

						<div style={styles.footerColumn}>
							<div style={styles.footerHeader}>Terms</div>
							<Link style={globalStyles.link} to={'/pub/tos'}><div style={styles.footerItem}>Terms of Service</div></Link>
							<Link style={globalStyles.link} to={'/pub/privacy'}><div style={styles.footerItem}>Privacy Policy</div></Link>
						</div>
					</div>

				</div>
			</div>
		);
	}

});

export default Radium(AppBody) ;

styles = {
	body: {
		// width: '100vw',
		// overflow: 'hidden',
		height: 'auto',
		minHeight: '100vh',
		backgroundColor: globalStyles.sideBackground,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// overflow: 'scroll',
		},
	},
	headerBar: {

		width: '100%',
		height: globalStyles.headerHeight,
		backgroundColor: globalStyles.headerBackground,
		margin: 0,
		zIndex: 55,
		// position: 'fixed',

		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// backgroundColor: 'red',
			height: globalStyles.headerHeightMobile,
		},
	},

	headerText: {

		lineHeight: globalStyles.headerHeight,
		color: globalStyles.headerText,
		textDecoration: 'none',
		':hover': {
			color: globalStyles.headerHover
		},
		fontFamily: globalStyles.headerFont,

		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			lineHeight: globalStyles.headerHeightMobile,
			fontSize: '1.5em',
		},

	},

	headerLogo: {
		// margin: '0 calc(50% - 105px) 0 0',
		padding: '0px',
		fontSize: '1em',
		float: 'left',
		// width: '75px',
		width: '50%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		// backgroundColor: 'red',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			margin: '0',
			width: 'calc(100% - 90px)',
		},

	},

	logoLink: {
		padding: '0px 15px',
		display: 'inline-block',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0px 20px 0px 10px',
		},
	},

	headerNavContainer: {
		margin: 0,
		fontSize: '0.9em',
		color: '#ddd',
		// backgroundColor: 'orange',
		float: 'left',
		// width: '50%',
		// width: 'calc(100% - 105px)',
		width: 'calc(50%)',
		textAlign: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '90px',
		},
	},
	headerNav: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	headerMenu: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	rightBorder: {
		padding: '0px 10px',
		float: 'right',
		cursor: 'pointer',
	},
	separator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 36px)',
			margin: '18px 0px',
		},
	},

	content: {
		position: 'relative',
		fontFamily: globalStyles.headerFont,
	},

	footer: {
		width: '95%',
		margin: '40px auto 0px auto',
		borderTop: '1px solid #CCC',
		padding: '40px 0px',
		fontFamily: globalStyles.headerFont,
		fontSize: '.9em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	footerColumn: {
		display: 'table-cell',
		width: '1px',
		padding: '0px 4vw',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 20px)',
			float: 'left',
			marginBottom: '25px',
			padding: '0px 10px',
		},
	},
	footerHeader: {
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
		paddingBottom: '2px',
		marginBottom: '8px',
		borderBottom: '1px solid #ccc',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// marginTop: '3em'
			// float: 'left',
			fontSize: '1.7em',
		},
	},
	footerItem: {
		color: '#333',
		whiteSpace: 'nowrap',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '1.5em',
			padding: '15px',
		}

	},

};
