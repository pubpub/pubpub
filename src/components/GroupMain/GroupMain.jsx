import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const GroupMain = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
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
				<div>GROUP MAIN</div>
			</div>
		);
	}
});

export default Radium(GroupMain);

styles = {

};
