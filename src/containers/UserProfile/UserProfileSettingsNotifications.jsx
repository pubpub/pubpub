import React, {PropTypes} from 'react';
import Radium from 'radium';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const UserProfileSettingsNotifications = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
	},

	render: function() {

		return (
			<div>
				<h3><FormattedMessage id="UserProfileSettingsNotifications.ComingSoon" defaultMessage="Notifications and their settings coming soon"/></h3>
			</div>
		);
	}
});

export default Radium(UserProfileSettingsNotifications);
