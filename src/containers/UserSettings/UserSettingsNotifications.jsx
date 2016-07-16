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
				<h3>Notifications and their settings coming soon</h3>
			</div>
		);
	}
});

export default Radium(UserSettingsNotifications);
