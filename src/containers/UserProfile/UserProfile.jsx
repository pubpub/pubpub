import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout, follow, unfollow, toggleVisibility} from '../../actions/login';
import {getProfile, updateUser, userNavOut, userNavIn, setNotificationsRead} from '../../actions/user';
import {ImageCropper, LoaderDeterminate, UserSettings, UserPubs, UserGroups, UserFollows, UserDiscussions, UserNotifications} from '../../components';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const Profile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	getInitialState: function() {
		return {
			userImageFile: null,
		};
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			if (getState().user.getIn(['profileData', 'username']) !== routerParams.username) {
				return dispatch(getProfile(routerParams.username));
			}
			return dispatch(userNavIn());
		}
	},

	componentWillUnmount() {
		this.props.dispatch(userNavOut());
	},

	ownProfile: function() {
		return this.props.loginData.getIn(['userData', 'username']) === this.props.username ? 'self' : 'other';
	},

	submitLogout: function() {
		this.props.dispatch(logout());
		this.props.dispatch(pushState(null, ('/')));
	},

	settingsSave: function(settingsObject) {
		// Send it off and save
		// If user image is in the settingsObject, on the server, save to cloudinary, etc.
		// console.log('settingsObject', settingsObject);
		this.props.dispatch(updateUser(settingsObject));
	},
	onFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({userImageFile: evt.target.files[0]});	
		}
	},
	cancelImageUpload: function() {
		this.setState({userImageFile: null});
	},
	userImageUploaded: function(url) {
		this.setState({userImageFile: null});
		this.settingsSave({image: url});
	},
	followUserToggle: function() {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		const analyticsData = {
			type: 'pubs',
			followedID: this.props.profileData.getIn(['profileData', '_id']),
			username: this.props.profileData.getIn(['profileData', 'username']),
			fullname: this.props.profileData.getIn(['profileData', 'fullname']),
			image: this.props.profileData.getIn(['profileData', 'image']),
			numFollowers: this.props.profileData.getIn(['profileData', 'followers']) ? this.props.profileData.getIn(['profileData', 'followers']).size : 0,
		};

		const isFollowing = this.props.loginData.getIn(['userData', 'following', 'users']) ? this.props.loginData.getIn(['userData', 'following', 'users']).indexOf(this.props.profileData.getIn(['profileData', '_id'])) > -1 : false;

		if (isFollowing) {
			this.props.dispatch( unfollow('users', this.props.profileData.getIn(['profileData', '_id']), analyticsData) );
		} else {
			this.props.dispatch( follow('users', this.props.profileData.getIn(['profileData', '_id']), analyticsData) );
		}
	},
	setNotificationsRead: function() {
		if (this.ownProfile() === 'self') {
			this.props.dispatch(setNotificationsRead(this.props.profileData.getIn(['profileData', '_id'])));	
		}
		
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

				<Helmet {...metaData} />

				<div style={profileStyles.profileWrapper}>
					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.profileData.get('status')]]}>
						<ul style={navStyles.navList}>

							{ /* ************** */ }
							{ /* Left Align Nav */ }
							{ /* ************** */ }
							{/* <Link to={'/user/' + this.props.username + '/pubs'} style={globalStyles.link}>
							<li key="profileNavLeft0"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}>
								<FormattedMessage {...globalMessages.pubs} />
							</li>
							</Link>
							<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}></li>
							
							<Link to={'/user/' + this.props.username + '/discussions'} style={globalStyles.link}>
							<li key="profileNavLeft1"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}>
								<FormattedMessage {...globalMessages.discussions} />
							</li>
							</Link>
							<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}></li>
							

							<Link to={'/user/' + this.props.username + '/groups'} style={globalStyles.link}>
							<li key="profileNavLeft2"style={[navStyles.navItem, navStyles.left, ownProfile === 'self' && navStyles.navItemShow, navStyles.noMobile]}>
								<FormattedMessage {...globalMessages.groups} />
							</li>
							</Link>
							<li style={[navStyles.navSeparator, navStyles.left, ownProfile === 'self' && navStyles.navItemShow, navStyles.noMobile]}></li>

							<Link to={'/user/' + this.props.username + '/follows'} style={globalStyles.link}>
							<li key="profileNavLeft3"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}>
								<FormattedMessage {...globalMessages.follows} />
							</li>
							</Link>
							<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}></li> */}

							{ /* *************** */ }
							{ /* Right Align Nav */ }
							{ /* *************** */ }
							<li key="profileNav0"style={[navStyles.navItem, ownProfile === 'self' && navStyles.navItemShow]} onClick={this.submitLogout}>
								<FormattedMessage {...globalMessages.Logout} />
							</li>
							<li style={[navStyles.navSeparator, ownProfile === 'self' && navStyles.navItemShow]}></li>

							<Link to={'/user/' + this.props.username + '/settings'} style={globalStyles.link}><li key="profileNav1"style={[navStyles.navItem, ownProfile === 'self' && navStyles.navItemShow]}>
								<FormattedMessage {...globalMessages.settings} />
							</li></Link>
							<li style={[navStyles.navSeparator, ownProfile === 'self' && navStyles.navItemShow]}></li>

							<li key="profileNav2"style={[navStyles.navItem, ownProfile === 'other' && navStyles.navItemShow]} onClick={this.followUserToggle}>
								{this.props.loginData.getIn(['userData', 'following', 'users']) && this.props.loginData.getIn(['userData', 'following', 'users']).indexOf(this.props.profileData.getIn(['profileData', '_id'])) > -1 
									? <FormattedMessage {...globalMessages.following} />
									: <FormattedMessage {...globalMessages.follow} />
								}
							</li>
							<li style={[navStyles.navSeparator, ownProfile === 'other' && styles.navItemShow]}></li>
							
						</ul>
					</div>
					
					<LoaderDeterminate value={this.props.profileData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.profileData.get('status')]]}>
						<div style={styles.userImageWrapper}>
							<img style={styles.userImage} src={profileData.image} />
							{/* <div key={'changeUserImageButton'} style={[styles.editImageButton, this.props.mode === 'settings' && styles.editImageButtonShow]} onClick={this.editImageClicked}>Change Image</div> */}
							<div style={[styles.fileInputWrapper, this.props.mode === 'settings' && ownProfile === 'self' && styles.fileInputWrapperShow]} key={'changeUserImageButton'}>
								<FormattedMessage id="user.changeImage" defaultMessage="Change Image"/>
								<input style={styles.hiddenFileInput} type="file" accept="image/*" onChange={this.onFileSelect} />
							</div>
						</div>

						{/* Content Wrapper is the right-hand side of the profile page.
							Everything except the image really */}
						<div style={[styles.contentWrapper, globalStyles[this.props.profileData.get('status')]]}>

							{/* User Details */}
							<div style={styles.profileNameWrapper}>
								<Link to={'/user/' + this.props.username} style={globalStyles.link}>
									<span style={styles.profileName} key={'userProfileName'}>{profileData.name}</span>
								</Link>
								{this.props.mode
									? null // <span style={styles.headerMode}>{': '}<FormattedMessage {...globalMessages[this.props.mode]} /></span>
									: null
								}
							</div>

							<p style={styles.profileDetail}>{profileData.title}</p>
							{/* <p style={styles.profileDetail}>Verfied with Twitter</p> */}
							<p style={styles.profileDetail}>{profileData.bio}</p>

							<ul style={[navStyles.navList, styles.subNav]}>
								<Link to={'/user/' + this.props.username + '/pubs'} style={globalStyles.link}>
								<li key="profileNavLeft0"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, styles.noLeftPadding, styles.inactiveNav, (!this.props.mode || this.props.mode === 'pubs') && styles.activeNav]}>
									<FormattedMessage {...globalMessages.pubs} />
								</li>
								</Link>
								<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}></li>
								
								<Link to={'/user/' + this.props.username + '/discussions'} style={globalStyles.link}>
								<li key="profileNavLeft1"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, styles.inactiveNav, this.props.mode === 'discussions' && styles.activeNav]}>
									<FormattedMessage {...globalMessages.discussions} />
								</li>
								</Link>
								<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}></li>
								

								<Link to={'/user/' + this.props.username + '/groups'} style={globalStyles.link}>
								<li key="profileNavLeft2"style={[navStyles.navItem, navStyles.left, ownProfile === 'self' && navStyles.navItemShow, styles.inactiveNav, this.props.mode === 'groups' && styles.activeNav]}>
									<FormattedMessage {...globalMessages.groups} />
								</li>
								</Link>
								<li style={[navStyles.navSeparator, navStyles.left, ownProfile === 'self' && navStyles.navItemShow, navStyles.noMobile]}></li>

								<Link to={'/user/' + this.props.username + '/follows'} style={globalStyles.link}>
								<li key="profileNavLeft3"style={[navStyles.navItem, navStyles.left, navStyles.navItemShow, styles.inactiveNav, this.props.mode === 'follows' && styles.activeNav]}>
									<FormattedMessage {...globalMessages.follows} />
								</li>
								</Link>
								<li style={[navStyles.navSeparator, navStyles.left, navStyles.navItemShow, navStyles.noMobile]}></li>

								<Link to={'/user/' + this.props.username + '/notifications'} style={globalStyles.link}>
								<li key="profileNavLeft4"style={[navStyles.navItem, navStyles.left, ownProfile === 'self' && navStyles.navItemShow, styles.inactiveNav, this.props.mode === 'notifications' && styles.activeNav]}>
									<FormattedMessage {...globalMessages.notifications} />
								</li>
								</Link>
								{/* <li style={[navStyles.navSeparator, navStyles.left, ownProfile === 'self' && navStyles.navItemShow, navStyles.noMobile]}></li> */}

								<li style={globalStyles.clearFix}></li>
							</ul>

							{(() => {
								switch (this.props.mode) {
								case 'discussions':
									return (
										<UserDiscussions 
											profileData={profileData}
											ownProfile={ownProfile}/>
									);
								case 'follows':
									return (
										<UserFollows 
											profileData={profileData}
											ownProfile={ownProfile}/>
									);
								case 'groups':
									return (
										<UserGroups 
											profileData={profileData}
											ownProfile={ownProfile}/>
									);
								case 'pubs':
									return (
										<UserPubs 
											profileData={profileData}
											ownProfile={ownProfile} />
									);
								case 'notifications':
									return (
										<UserNotifications
											profileData={profileData}
											ownProfile={ownProfile} 
											setNotificationsReadHandler={this.setNotificationsRead}/>
									);
								case 'settings':
									return (
										<UserSettings 
											profileData={profileData}
											ownProfile={ownProfile} 
											saveStatus={this.props.profileData.get('settingsStatus')}
											handleSettingsSave={this.settingsSave}/>
									);
								default:
									return (
										<UserPubs 
											profileData={profileData}
											ownProfile={ownProfile} />
									);
									// return (
									// 	<UserMain 
									// 		profileData={profileData}
									// 		ownProfile={ownProfile}
									// 		username={this.props.username}/>
									// );
								}
							})()}
							
						</div>
					</div>


					<div style={[styles.imageCropperWrapper, this.state.userImageFile !== null && styles.imageCropperWrapperVisible]} >
						<div style={styles.imageCropperContainer}>
							<ImageCropper height={150} width={150} image={this.state.userImageFile} onCancel={this.cancelImageUpload} onUpload={this.userImageUploaded}/>
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
	profileDetail: {
		margin: '4px 0px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textAlign: 'center',
			fontSize: '20px',
		},
	},
	subNav: {
		margin: '35px 0px 0px 0px',
		fontSize: '20px',
		borderBottom: '1px solid #CCC',
		minWidth: '569px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'auto',
			borderTop: '1px solid #CCC',
		},
	},
	noLeftPadding: {
		padding: '0px 20px 0px 2px',
	},
	inactiveNav: {
		color: '#bbb',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% / 3)',
			height: 60,
			margin: '20px 0px',
		},
	},
	activeNav: {
		color: '#333',
	},
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
	editImageButton: {
		width: '100%',
		textAlign: 'center',
		display: 'none',
		userSelect: 'none',
		cursor: 'pointer',
		':hover': {
			color: 'black',
		}
	},
	editImageButtonShow: {
		display: 'block',
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
	},
	fileInputWrapper: {
		width: '100%',
		textAlign: 'center',
		display: 'none',
		userSelect: 'none',
		position: 'relative',
		':hover': {
			color: 'black',
		}
	},
	fileInputWrapperShow: {
		display: 'block'
	},
	hiddenFileInput: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		outline: 'none',
		opacity: 0,
		left: 0,
		top: 0,
		cursor: 'pointer',
	},
	imageCropperWrapper: {
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		width: '100vw',
		backgroundColor: 'rgba(255,255,255,0.8)',
		position: 'fixed',
		top: globalStyles.headerHeight,
		left: 0,
		opacity: 0,
		pointerEvents: 'none',
		transition: '.1s linear opacity',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			height: 'auto',
			minHeight: 'calc(100vh - ' + globalStyles.headerHeightMobile + ')',
			top: globalStyles.headerHeightMobile,
			left: 0,
		},
	},
	imageCropperContainer: {
		width: 400,
		height: 300,
		backgroundColor: 'white',
		margin: '0 auto',
		position: 'relative',
		top: '50%',
		transform: 'translateY(-50%)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'auto',
			width: '100%',
			top: 0,
			transform: 'translateY(0%)',
		}
	},
	imageCropperWrapperVisible: {
		opacity: 1,
		pointerEvents: 'auto',
	},
};
