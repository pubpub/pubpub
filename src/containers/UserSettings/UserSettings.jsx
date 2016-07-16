import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {Link} from 'react-router';

import {saveUserSettings} from './actions';

import {NavContentWrapper} from 'components';
import UserSettingsProfile from './UserSettingsProfile';
import UserSettingsAccount from './UserSettingsAccount';
import UserSettingsNotifications from './UserSettingsNotifications';
import {safeGetInToJS} from 'utils/safeParse';
import {globalStyles} from 'utils/styleConstants';

let styles = {};

export const UserSettings = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		userSettingsData: PropTypes.object,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	saveSettings: function(settings) {
		this.props.dispatch(saveUserSettings(settings));
	},

	render: function() {
		const userData = safeGetInToJS(this.props.loginData, ['userData']) || {};

		const metaData = {
			title: 'Settings · ' + userData.name,
		};

		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: 'Follow', action: this.followUserToggle },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];
		const navItems = [
			{ type: 'link', text: 'Profile', link: '/settings', active: !this.props.mode},
			{ type: 'link', text: 'Account', link: '/settings/account', active: this.props.mode === 'account'},
			{ type: 'link', text: 'Notifications', link: '/settings/notifications', active: this.props.mode === 'notifications' },
		];

		return (
			<div>

				<Helmet {...metaData} />

				<div className={'profile-header section'}>
					<div style={styles.headerImageWrapper}>
						<img src={'https://jake.pubpub.org/unsafe/150x150/' + userData.image} />
					</div>
					<div style={styles.headerTextWrapper}>
						<h1>User Settings</h1>
						<Link style={globalStyles.link} to={'/user/' + userData.username}><h1 style={styles.subH1}>{userData.name}</h1></Link>
					</div>
				</div>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
					{(() => {
						switch (this.props.mode) {
						case 'account':
							return (
								<UserSettingsAccount
									settingsData={this.props.userSettingsData}
									loginData={this.props.loginData}
									saveSettingsHandler={this.saveSettings}/>
							);
						case 'notifications':
							return (
								<UserSettingsNotifications
									settingsData={this.props.userSettingsData}
									loginData={this.props.loginData}
									saveSettingsHandler={this.saveSettings}/>
							);
						default:
							return (
								<UserSettingsProfile
									settingsData={this.props.userSettingsData}
									loginData={this.props.loginData}
									saveSettingsHandler={this.saveSettings}/>
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
		userSettingsData: state.userSettings,
		mode: state.router.params.mode,
	};
})( Radium(UserSettings) );

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
	subH1: {
		fontWeight: 'normal',
		fontSize: '2.5em',
		marginTop: '-.5em',
	},
};
