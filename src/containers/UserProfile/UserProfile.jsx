import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout, follow, unfollow, toggleVisibility} from 'containers/Login/actions';
import {getProfile, updateUser, userNavOut, userNavIn, setNotificationsRead} from './actions';
import {ContentNav} from 'components';
import UserProfileDiscussions from './UserProfileDiscussions';
import UserProfileSettings from './UserProfileSettings';
import UserProfilePubs from './UserProfilePubs';
import UserProfileGroups from './UserProfileGroups';
import UserProfileFollows from './UserProfileFollows';
import UserProfileNotifications from './UserProfileNotifications';

import {globalStyles, profileStyles, navStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
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

		const navItems = [
			{ type: 'button', mobile: true, text: 'Follow', action: ()=>{console.log('clicked follow');} },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
			{ type: 'link', text: 'Recent Activity', link: '/' },
			{ type: 'spacer' },
			{ type: 'link', text: 'Pubs', link: '/' },
			{ type: 'link', text: 'Groups', link: '/' },
			{ type: 'link', text: 'Journals', link: '/' },
			{ type: 'spacer' },
		];

		return (
			<div>

				<Helmet {...metaData} />

				<div className={'profile-header section'}>
					<div style={styles.headerImageWrapper}>
						<img src={'https://jake.pubpub.org/unsafe/200x200/' + profileData.image} />
					</div>
					<div style={styles.headerTextWrapper}>
						<h1>{profileData.name}</h1>
						<p>{profileData.bio}</p>
					</div>
				</div>

				<div className={'section contentSection'}>
					
					{/* <Link to={'/'} className={'contentNavLink'}>Recent Activity</Link>
					<div className={'contentNavSpacer'}></div>
					<Link to={'/'} className={'contentNavLink'}>Pubs</Link>
					<Link to={'/'} className={'contentNavLink'}>Groups</Link>
					<Link to={'/'} className={'contentNavLink'}>Journals</Link>
					<Link to={'/'} className={'contentNavLink'}>Assets</Link>
					<div className={'contentNavSpacer'}></div> */}
					<ContentNav navItems={navItems} />


					<div className={'contentBody'}>
						{(() => {
							switch (this.props.mode) {
							case 'discussions':
								return (
									<UserProfileDiscussions
										profileData={profileData}
										ownProfile={ownProfile}/>
								);
							case 'follows':
								return (
									<UserProfileFollows
										profileData={profileData}
										ownProfile={ownProfile}/>
								);
							case 'groups':
								return (
									<UserProfileGroups
										profileData={profileData}
										ownProfile={ownProfile}/>
								);
							case 'pubs':
								return (
									<UserProfilePubs
										profileData={profileData}
										ownProfile={ownProfile} />
								);
							case 'notifications':
								return (
									<UserProfileNotifications
										profileData={profileData}
										ownProfile={ownProfile}
										setNotificationsReadHandler={this.setNotificationsRead}/>
								);
							case 'settings':
								return (
									<UserProfileSettings
										profileData={profileData}
										ownProfile={ownProfile}
										saveStatus={this.props.profileData.get('settingsStatus')}
										handleSettingsSave={this.settingsSave}/>
								);
							default:
								return (
									<UserProfilePubs
										profileData={profileData}
										ownProfile={ownProfile} />
								);
							}
						})()}
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
	headerImageWrapper: {
		textAlign: 'center',
		display: 'table-cell',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	headerTextWrapper: {
		padding: '0em 1em',
		display: 'table-cell',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			textAlign: 'center',
			padding: '0em',
		}
	},
	// profileContentSection: {
	// 	paddingTop: '0em',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		padding: '0em',
	// 	}
	// },

	// contentNavLink: {
	// 	display: 'block',
	// 	textDecoration: 'none',
	// 	color: 'inherit',
	// 	padding: '.25em 2em .25em .25em',
	// 	borderRight: '1px solid #BBBDC0',
	// },
	// contentNavSpacer: {
	// 	height: '1em',
	// 	borderRight: '1px solid #BBBDC0',
	// },
	// profileContentNav: {
	// 	whiteSpace: 'nowrap',
	// 	display: 'table-cell',
	// 	verticalAlign: 'top',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'block',
	// 	}

	// },
	// profileContentBody: {
	// 	display: 'table-cell',
	// 	verticalAlign: 'top',
	// 	padding: '.5em 1em',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'block',
	// 		padding: '0em',
	// 	}
	// },
	
};
