import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { PreviewPub } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const UserPubs = React.createClass({
	propTypes: {
		user: PropTypes.object,
		ownProfile: PropTypes.bool,
		pathname: PropTypes.string, 
		query: PropTypes.object,
	},

	render() {
		const user = this.props.user || {};
		const pubs = user.pubs || [];
		
		return (
			<div style={styles.container}>
				{pubs.filter((pub)=> {
					return !pub.replyRootPubId;
				}).map((pub, index)=> {
					return <PreviewPub key={'pub-' + pub.id} pub={pub} />;
				})}
			</div>
		);
	}
});

export default Radium(UserPubs);

styles = {
	container: {
		
	},
};
