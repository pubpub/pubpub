import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { PreviewUser } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const UserFollowers = React.createClass({
	propTypes: {
		user: PropTypes.object,
		ownProfile: PropTypes.bool,
		pathname: PropTypes.string, 
		query: PropTypes.object,
	},

	render() {
		const user = this.props.user || {};
		const followers = user.followers || [];

		return (
			<div style={styles.container}>
				<h2>Followers</h2>

				{followers.map((follower, index)=> {
					return <PreviewUser key={'follower-' + index} user={follower} />;
				})}

			</div>
		);
	}
});

export default Radium(UserFollowers);

styles = {
	container: {
		
	},
};
