import React, { PropTypes } from 'react';
import Radium, {Style, PrintStyleSheet} from 'radium';
import { Link } from 'react-router';
import {reset} from 'redux-form';
import {Login} from '../index';
import {connect} from 'react-redux';
import {toggleVisibility} from '../../actions/login';
import {loadJournalAndLogin} from '../../actions/journal';
import {openMenu, closeMenu} from '../../actions/nav';
import {openPubModal} from '../../actions/pub';
import {HeaderNav, HeaderMenu} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};
const App = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		navData: PropTypes.object,
		pubData: PropTypes.object,
		path: PropTypes.string,
		slug: PropTypes.string,
		children: PropTypes.object.isRequired,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch) {
			if (getState().journal.get('status') === 'loaded') {
				return dispatch(loadJournalAndLogin());				
			}
			return ()=>{};		
		}
	},

	componentWillReceiveProps: function(nextProps) {
		// Close the menu if we're changing routes and it's open
		if (this.props.path !== nextProps.path && nextProps.navData.get('menuOpen')) {
			this.props.dispatch(closeMenu());
		}
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

	render: function() {
		let pathname = 'notlanding';
		if (this.props.path === '/') {
			pathname = 'landing';
		}
		let headerTextColor = globalStyles.headerText;
		let headerTextColorHover = globalStyles.headerHover;
		if (this.props.path === '/') {
			headerTextColor = globalStyles.headerBackground;
			headerTextColorHover = 'black';
		}

		return (
			<div style={styles.body}>

				{
					// Set the body to not scroll if you have the login window or the mobile menu open
					this.props.loginData.get('isVisible') || this.props.navData.get('menuOpen') || (this.props.pubData.get('activeModal') !== undefined && this.props.path.indexOf('/pub/') > -1)
						? <Style rules={{'body': {overflow: 'hidden'}}} />
						: null
				}
				<PrintStyleSheet />

				<div className="header-bar" style={[styles.headerBar, styles[pathname].headerBar]}>
					
					<Link to={`/`}><div key="headerLogo" style={[styles.headerText, styles.headerLogo, styles[pathname].headerText]}>PubPub</div></Link>
					
					<div style={[styles.headerNavContainer]} >
						<div style={styles.headerMenu}>
							<HeaderMenu 
								loginData={this.props.loginData} 
								// navData={this.props.navData}
								color={headerTextColor}
								hoverColor={headerTextColorHover}
								loginToggle={this.toggleLogin}

								menuOpen={this.props.navData.get('menuOpen') ? true : false}
								openMenuHandler={this.openMenu}
								closeMenuHandler={this.closeMenu}
								openPubModalHandler={this.openPubModal}
								pubStatus={this.props.pubData.getIn(['pubData', 'status'])}
								
								slug={this.props.slug}/>
						</div>

						<div style={styles.headerNav}>
							<HeaderNav 
								loginData={this.props.loginData} 
								navData={this.props.navData}
								color={headerTextColor}
								hoverColor={headerTextColorHover}
								loginToggle={this.toggleLogin}/>
						</div>
					</div>

				</div>

				<Login />

				<div className="content" style={styles.content}>
					{this.props.children}
				</div>
	
			</div>
		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
		loginData: state.login, 
		navData: state.nav,
		pubData: state.pub,
		path: state.router.location.pathname,
		// query: state.router.location.query,
		slug: state.router.params.slug,
		// delta: state.nav.get('delta'),
	};
})( Radium(App) );


styles = {
	notlanding: {},
	landing: {
		headerText: {
			color: globalStyles.headerBackground,
			':hover': {
				color: 'black'
			},
		},
		headerBar: {
			backgroundColor: globalStyles.headerText,
		},
	},
	logo: {
		// height: 30,
	},
	body: {
		// width: '100vw',
		overflow: 'hidden',
		height: 'auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// overflow: 'scroll',
		},
	},
	headerBar: {
		
		width: '100%',
		height: globalStyles.headerHeight,
		backgroundColor: globalStyles.headerBackground,
		margin: 0,
		zIndex: 5,
		position: 'fixed',

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
		padding: '0px 15px',
		fontSize: '1em',
		float: 'left',
		width: '75px',
		// backgroundColor: 'red',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '1.5em',
			margin: '0',
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
		width: 'calc(100% - 105px)',
		textAlign: 'right',
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	width: 'calc(100% - 105px)',
		// },
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
		width: '100%',
		position: 'relative',
		marginTop: globalStyles.headerHeight,
		height: 'auto',
		// backgroundColor: 'red',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginTop: globalStyles.headerHeightMobile,
			
		},
	},

};
