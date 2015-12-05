import React, { PropTypes } from 'react';
import Radium, {Style} from 'radium';
import { Link } from 'react-router';
import {reset} from 'redux-form';
import {Login} from '../index';
import {connect} from 'react-redux';
import {toggleVisibility, restoreLogin} from '../../actions/login';
import {updateDelta} from '../../actions/nav';
import {HeaderNav, HeaderMenu} from '../../components';
import {globalStyles} from '../../utils/styleConstants';
import { pushState, go } from 'redux-router';

let styles = {};
const App = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		navData: PropTypes.object,
		pubData: PropTypes.object,
		path: PropTypes.string,
		query: PropTypes.object,
		slug: PropTypes.string,
		delta: PropTypes.number,
		children: PropTypes.object.isRequired,
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch) {
			if (!getState().login.get('attemptedRestoreState')) {
				return dispatch(restoreLogin());		
			}
			return ()=>{};	
	
		}
	},

	toggleLogin: function() {
		if (!this.props.loginData.get('loggedIn')) {
			this.props.dispatch(toggleVisibility());
			this.props.dispatch(reset('loginForm'));
			this.props.dispatch(reset('loginFormRegister'));	
		}
		
		
	},

	goBack: function(backCount) {
		if (this.props.delta + backCount < 0) {
			// If there is no history with which to go back, clear the query params
			this.props.dispatch(pushState(null, this.props.path, {}));
		} else {
			this.props.dispatch(updateDelta(backCount + 1)); // Keep track of nav.delta so we can handle cases where the page was directly navigated to.
			this.props.dispatch(go(backCount));
			
		}
	},

	setQuery: function(queryObject) {
		this.props.dispatch(pushState(null, this.props.path, {...this.props.query, ...queryObject}));
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

		// const mquery = {mediaQueries: {
		// 	'(min-width: 1050px)': {
		// 		body: {
		// 			fontSize: '320%'
		// 		}
		// 	},
		// }};
		// : <Style rules={mquery} />
		return (
			<div style={styles.body}>

				{
					// Set the body to not scroll if you have the login window or the mobile menu open
					this.props.loginData.get('isVisible') || this.props.query.menu !== undefined || (this.props.query.mode !== undefined && this.props.path.indexOf('/pub/') > -1)
						? <Style rules={{'body': {overflow: 'hidden'}}} />
						: null
				}
				

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

								menuOpen={this.props.query.menu ? true : false}
								goBackHandler={this.goBack}
								setQueryHandler={this.setQuery}
								
								urlPath={this.props.path}/>
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
		loginData: state.login, 
		navData: state.nav,
		readerData: state.reader,
		path: state.router.location.pathname,
		query: state.router.location.query,
		slug: state.router.params.slug,
		delta: state.nav.get('delta'),
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
		width: '100vw',
		overflow: 'hidden',
		height: 'auto',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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

		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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

		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		// '@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
		// 	width: 'calc(100% - 105px)',
		// },
	},
	headerNav: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
	}, 
	headerMenu: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			marginTop: globalStyles.headerHeightMobile,
			
		},
	},

};
