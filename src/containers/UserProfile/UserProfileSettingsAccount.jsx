import React, {PropTypes} from 'react';
import Radium from 'radium';

export const UserSettingsAccount = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
	},

	render: function() {

		return (
			<div>
				Here is a bunch of details for my Account

				<div className={'button'}>Save Account Settings</div>
				
			</div>
		);
	}
});

export default Radium(UserSettingsAccount);
