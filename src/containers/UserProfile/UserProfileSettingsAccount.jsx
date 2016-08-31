import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const UserProfileSettingsAccount = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
	},

	render: function() {

		return (
			<div>
				<FormattedMessage id="userProfileSettings.HereIsABunch" defaultMessage="Here is a bunch of details for my Account"/>

				<div className={'button'}><FormattedMessage id="userProfileSettings.Save" defaultMessage="Save Account Settings"/></div>

			</div>
		);
	}
});

export default Radium(UserProfileSettingsAccount);
