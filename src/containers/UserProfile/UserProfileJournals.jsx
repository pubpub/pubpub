import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {PreviewCard} from 'components';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const UserProfileJournals = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			
		};
	},

	render: function() {
		const profileData = this.props.profileData || {};
		
		return (
			<div>

				<h3>Journals</h3>

			</div>
		);
	}
});

export default Radium(UserProfileJournals);
