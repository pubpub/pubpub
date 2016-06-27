import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout, follow, unfollow, toggleVisibility} from 'containers/Login/actions';
import {getProfile, updateUser, userNavOut, userNavIn, setNotificationsRead} from './actions';
import {NavContentWrapper} from 'components';
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
		fetchData: function(getState, dispatch, location, routerParams) {
			return dispatch(getProfile(routerParams.username));
		}
	},

	// componentWillUnmount() {
	// 	this.props.dispatch(userNavOut());
	// },

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

		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: 'Follow', action: this.followUserToggle },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const navItems = [
			{ type: 'link', text: 'Recent Activity', link: '/user/' + this.props.username, active: this.props.mode === undefined},
			{ type: 'spacer' },
			{ type: 'link', text: 'Pubs', link: '/user/' + this.props.username + '/pubs', active: this.props.mode === 'pubs' },
			{ type: 'link', text: 'Groups', link: '/user/' + this.props.username + '/groups', active: this.props.mode === 'groups'},
			{ type: 'link', text: 'Journals', link: '/user/' + this.props.username + '/journals', active: this.props.mode === 'journals'},
		];

		return (
			<div>

				<Helmet {...metaData} />

				<div className={'profile-header section'}>
					<div style={styles.headerImageWrapper}>
						<img src={'https://jake.pubpub.org/unsafe/150x150/' + profileData.image} />
					</div>
					<div style={styles.headerTextWrapper}>
						<h1>{profileData.name}</h1>
						<p>{profileData.bio}</p>
						<p>{profileData.links}</p>
					</div>
				</div>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
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
				</NavContentWrapper>

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
};
