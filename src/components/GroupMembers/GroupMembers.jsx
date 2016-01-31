import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const GroupMembers = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
		isAdmin: PropTypes.bool,
		saveStatus: PropTypes.string,
		handleMemberSave: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			groupData: {
				pubs: [],
			},
		};
	},

	render: function() {
		// console.log(this.props.groupData);
		return (
			<div style={styles.container}>
				<div>GROUP MEMBERS</div>
			</div>
		);
	}
});

export default Radium(GroupMembers);

styles = {

};
