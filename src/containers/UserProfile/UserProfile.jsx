import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {getUser, saveUserSettings} from './actions';
import {NavContentWrapper} from 'components';
import {NotFound} from 'components';
import {FollowButton, Manage} from 'containers';

import UserProfilePubs from './UserProfilePubs';
import UserProfileJournals from './UserProfileJournals';
import UserProfileFollowers from './UserProfileFollowers';
import UserProfileFollowing from './UserProfileFollowing';


import UserProfileSettingsProfile from './UserProfileSettingsProfile';
import UserProfileSettingsAccount from './UserProfileSettingsAccount';
import UserProfileSettingsNotifications from './UserProfileSettingsNotifications';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const UserProfile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routerParams) {
			return dispatch(getUser(routerParams.username));
		}
	},

	saveSettings: function(settings) {
		this.props.dispatch(saveUserSettings(settings));
	},

	render: function() {
		let profileData = safeGetInToJS(this.props.profileData, ['profileData']) || {};
		const loginUserData = safeGetInToJS(this.props.loginData, ['userData']) || {};
		const ownProfile = safeGetInToJS(this.props.loginData, ['userData', 'username']) === this.props.username;

		if (ownProfile) {
			profileData = {
				...profileData,
				...loginUserData,
			};
		}
		const metaData = {
			title: (profileData.name || profileData.username) + ' · PubPub',
			meta: [
				{property: 'og:title', content: (profileData.name || profileData.username)},
				{property: 'og:type', content: 'article'},
				{property: 'og:description', content: profileData.bio},
				{property: 'og:url', content: 'https://www.pubpub.org/user/' + profileData.username},
				{property: 'og:image', content: profileData.image},
				{property: 'og:image:url', content: profileData.image},
				{property: 'og:image:width', content: '500'},
				{name: 'twitter:card', content: 'summary'},
				{name: 'twitter:site', content: '@pubpub'},
				{name: 'twitter:title', content: (profileData.name || profileData.username)},
				{name: 'twitter:description', content: profileData.bio || (profileData.name || profileData.username)},
				{name: 'twitter:image', content: profileData.image},
				{name: 'twitter:image:alt', content: 'Image of ' + (profileData.name || profileData.username)}
			]
		};

		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Follow}/>, action: this.followUserToggle },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu}/>, action: undefined },
		];

		const ownProfileItems = ownProfile
		? [
			{ type: 'spacer' },
			{ type: 'title', text: <FormattedMessage {...globalMessages.Settings}/>},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Profile}/>, link: '/user/' + this.props.username + '/profile', active: this.props.mode === 'profile'},
			// { type: 'link', text: 'Account', link: '/user/' + this.props.username + '/account', active: this.props.mode === 'account'},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Notifications}/>, link: '/user/' + this.props.username + '/notifications', active: this.props.mode === 'notifications' },
		]
		: [];
		const navItems = [
			{ type: 'link', text: 'Featured', link: '/user/' + this.props.username, active: this.props.mode === undefined},
			// { type: 'link', text: 'Groups', link: '/user/' + this.props.username + '/groups', active: this.props.mode === 'groups'},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Pubs}/>, link: '/user/' + this.props.username + '/pubs', active: this.props.mode === 'pubs'},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Journals}/>, link: '/user/' + this.props.username + '/journals', active: this.props.mode === 'journals'},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Followers}/>, link: '/user/' + this.props.username + '/followers', active: this.props.mode === 'followers'},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Following}/>, link: '/user/' + this.props.username + '/following', active: this.props.mode === 'following'},

			...ownProfileItems,
		];

		if (!ownProfile) {
			navItems.splice(1, 1);
		}
		

		const links = [
			{key: 'publicEmail', href: 'mailto:' + profileData.publicEmail, text: <span>{profileData.publicEmail}</span>},
			{key: 'website', href: profileData.website, text: <span>{profileData.website}</span>},
			{key: 'twitter', href: 'https://twitter.com/' + profileData.twitter, text: <span>@{profileData.twitter}</span>},
			{key: 'github', href: 'https://github.com/' + profileData.github, text: <span>github.com/{profileData.github}</span>},
			{key: 'orcid', href: 'https://orcid.org/' + profileData.orcid, text: <span>orcid.com/{profileData.orcid}</span>},
			{key: 'googleScholar', href: 'https://scholar.google.com/citations?user=' + profileData.googleScholar, text: <span>Google Scholar</span>},
		];

		let mode = this.props.mode;
		if (!ownProfile && (mode === 'profile' || mode === 'notifications' || mode === 'account')) {
			mode = 'notFound';
		}

		return (
			<div>

				<Helmet {...metaData} />

				<div className={'profile-header section'}>
					<div style={styles.headerImageWrapper}>
						<img src={'https://jake.pubpub.org/unsafe/150x150/' + profileData.image} />
					</div>
					<div style={styles.headerTextWrapper}>

						<h1 style={styles.showOnMobile}>{profileData.name}</h1> {/* Duplicate header for cleaner Follow button rendering */}

						{!ownProfile &&
							<FollowButton id={profileData._id} type={'followsUser'} isFollowing={profileData.isFollowing} buttonStyle={styles.followButtonStyle}/>
						}

						<h1 style={styles.hideOnMobile}>{profileData.name}</h1> {/* Duplicate header for cleaner Follow button rendering */}
						<p>{profileData.bio}</p>

						{links.filter((link)=> {
							return !!profileData[link.key];
						}).map((link, index)=> {
							return <a key={'link-' + index} className={'underlineOnHover'} style={[styles.link, index === 0 && styles.firstLink]} href={link.href}>{link.text}</a>;
						})}
					</div>


				</div>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
					{(() => {
						switch (mode) {
						case 'pubs':
							return <Manage ownProfile={ownProfile}/>;
						case 'journals':
							return (
								<UserProfileJournals
									profileData={this.props.profileData}
									ownProfile={ownProfile}/>
							);
						case 'account':
							return (
								<UserProfileSettingsAccount
									settingsData={this.props.profileData}
									loginData={this.props.loginData}
									saveSettingsHandler={this.saveSettings}/>
							);
						case 'notifications':
							return (
								<UserProfileSettingsNotifications
									settingsData={this.props.profileData}
									loginData={this.props.loginData}
									saveSettingsHandler={this.saveSettings}/>
							);
						case 'profile':
							return (
								<UserProfileSettingsProfile
									settingsData={this.props.profileData}
									loginData={this.props.loginData}
									saveSettingsHandler={this.saveSettings}/>
							);
						case 'followers':
							return (
								<UserProfileFollowers
									profileData={this.props.profileData}/>
							);
						case 'following':
							return (
								<UserProfileFollowing
									profileData={this.props.profileData}/>
							);
						case 'notFound':
							return null;

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
})( Radium(UserProfile) );

styles = {
	followButtonStyle: {
		float: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			float: 'none',
			maxWidth: '80%',
			margin: '1em auto',
		}
	},
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
		width: '100%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			textAlign: 'center',
			padding: '0em',
		}
	},
	link: {
		paddingLeft: '1em',
		marginLeft: '1em',
		borderLeft: '1px solid #BBBDC0',
		textDecoration: 'none',
		color: 'inherit',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingLeft: 'auto',
			marginLeft: 'auto',
			borderLeft: '0px solid #BBBDC0',
		},
	},
	firstLink: {
		borderLeft: '0px solid #BBBDC0',
		paddingLeft: '0em',
		marginLeft: '0em',
	},
	hide: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	showOnMobile: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	hideOnMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
};
