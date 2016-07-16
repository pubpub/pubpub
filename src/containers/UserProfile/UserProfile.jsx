import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {getProfile} from './actions';
import {NavContentWrapper} from 'components';

import UserProfileDiscussions from './UserProfileDiscussions';
import UserProfileSettings from './UserProfileSettings';
import UserProfilePubs from './UserProfilePubs';
import UserProfileGroups from './UserProfileGroups';
import UserProfileFollows from './UserProfileFollows';
import UserProfileNotifications from './UserProfileNotifications';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

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
		fetchData: function(getState, dispatch, location, routerParams) {
			return dispatch(getProfile(routerParams.username));
		}
	},

	render: function() {
		const profileData = safeGetInToJS(this.props.profileData, ['profileData']) || {};
		const ownProfile = safeGetInToJS(this.props.loginData, ['userData', 'username']) === this.props.username ? 'self' : 'other';
		const metaData = {
			title: (profileData.name || profileData.username) + ' · PubPub',
		};
		

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
			{ type: 'spacer' },
			{ type: 'link', text: 'Settings', link: '/settings'},
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
