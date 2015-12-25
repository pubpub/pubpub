import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout} from '../../actions/login';
import {getProfile} from '../../actions/user';
import {LoaderDeterminate, UserMain, UserSettings} from '../../components';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

let styles = {};

const Profile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			if (getState().user.getIn(['profileData', 'username']) !== routerParams.username) {
				return dispatch(getProfile(routerParams.username));
			}
			return ()=>{};	
		}
	},

	ownProfile: function() {
		return this.props.loginData.getIn(['userData', 'username']) === this.props.username ? 'self' : 'other';
	},

	submitLogout: function() {
		this.props.dispatch(logout());
		this.props.dispatch(pushState(null, ('/')));
	},

	render: function() {
		const metaData = {};
		if (this.props.profileData.getIn(['profileData', 'name'])) {
			metaData.title = 'PubPub - ' + this.props.profileData.getIn(['profileData', 'name']);
		} else {
			metaData.title = 'PubPub - ' + this.props.username;
		}

		let profileData = {};
		if (this.props.profileData.get('profileData').toJS) {
			profileData = this.props.profileData.get('profileData').toJS();
		}

		const ownProfile = this.ownProfile();

		return (
			<div style={profileStyles.profilePage}>

				<DocumentMeta {...metaData} />

				<div style={profileStyles.profileWrapper}>
					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.profileData.get('status')]]}>
						<ul style={navStyles.navList}>

							<li key="profileNav0"style={[navStyles.navItem, ownProfile === 'self' && navStyles.navItemShow]} onClick={this.submitLogout}>Logout</li>
							<li style={[navStyles.navSeparator, ownProfile === 'self' && navStyles.navItemShow]}></li>

							<Link to={'/user/' + this.props.username + '/settings'} style={globalStyles.link}><li key="profileNav1"style={[navStyles.navItem, ownProfile === 'self' && navStyles.navItemShow]}>Settings</li></Link>
							<li style={[navStyles.navSeparator, ownProfile === 'self' && navStyles.navItemShow]}></li>

							<li key="profileNav2"style={[navStyles.navItem, ownProfile === 'other' && navStyles.navItemShow]}>Follow</li>
							<li style={[navStyles.navSeparator, ownProfile === 'other' && styles.navItemShow]}></li>
							
						</ul>
					</div>
					
					<LoaderDeterminate value={this.props.profileData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.profileData.get('status')]]}>
						<div style={styles.userImageWrapper}>
							<img style={styles.userImage} src={profileData.image} />
						</div>

						{/* Content Wrapper is the right-hand side of the profile page.
							Everything except the image really */}
						<div style={styles.contentWrapper}>


							{/* User Details */}
							<div style={styles.profileNameWrapper}>
								<Link to={'/user/' + this.props.username} style={globalStyles.link}>
									<span style={styles.profileName} key={'userProfileName'}>{profileData.name}</span>
								</Link>
								<span style={[styles.headerMode, this.props.mode && styles.headerModeShow]}>: {this.props.mode}</span>
							</div>

							{() => {
								switch (this.props.mode) {
								case 'settings':
									return (
										<UserSettings />
									);
								default:
									return (
										<UserMain 
											profileData={profileData}
											ownProfile={ownProfile}/>
									);
								}
							}()}
							
						</div>
						

					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		profileData: state.user, 
		username: state.router.params.username,
		mode: state.router.params.mode,
	};
})( Radium(Profile) );

styles = {
	userImageWrapper: {
		margin: 30,
		width: 150,
		height: 150,
		border: '1px solid rgba(0,0,0,0.1)',
		borderRadius: '1px',
		float: 'left',
		// backgroundColor: 'rgba(190,250,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			margin: '30px auto',
		},
	},
	userImage: {
		width: '100%',
		height: '100%',
		
	},
	contentWrapper: {
		float: 'left',
		width: 'calc(100% - 242px)',
		// backgroundColor: 'rgba(255,190,89,0.4)',
		margin: '30px 30px 60px 0px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			width: 'calc(100% - 30px)',
			padding: '0px 15px',
		},
	},
	profileNameWrapper: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textAlign: 'center',
		},
	},
	profileName: {
		margin: 0,
		fontSize: '40px',
		':hover': {
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '50px',
		},

	},
	headerMode: {
		color: '#888',
		fontSize: 30,
		display: 'none',
	},
	headerModeShow: {
		display: 'inline',
	},
};
