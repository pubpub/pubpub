import React, {PropTypes} from 'react';
import Radium from 'radium';

export const UserSettingsNotifications = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
	},

	render: function() {

		return (
			<div>
				Here is a bunch of details for my Notifications

				<div className={'button'}>Save Notification Settings</div>
				
			</div>
		);
	}
});

export default Radium(UserSettingsNotifications);
