import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

import {generateToken} from './actions';
import {safeGetInToJS} from 'utils/safeParse';


export const UserProfileAccessTokens = React.createClass({
	propTypes: {
		settingsData: PropTypes.object,
		saveSettingsHandler: PropTypes.func,
		dispatch: PropTypes.func,
		token: PropTypes.string

	},

  generateToken: function(evt) {
    this.props.dispatch(generateToken());
  },
	render: function() {
		// const token = safeGetInToJS(this.props.settingsData, ['profileData', 'accessToken'])
		const token = safeGetInToJS(this.props.settingsData, ['token']) ? safeGetInToJS(this.props.settingsData, ['token']) : safeGetInToJS(this.props.settingsData, ['profileData', 'accessToken']);
		return (
			<div>
				<h3><FormattedMessage id="UserProfileSettingsNotifications.accessTokens" defaultMessage="Accces Tokens allow you to authenticate to the API over Basic Authentication."/></h3>
				<p>{token}</p>
        <button className={'button'} onClick={this.generateToken}>
          Generate New Token
        </button>
			</div>
		);
	}
});

export default Radium(UserProfileAccessTokens);
