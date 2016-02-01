import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {LoaderIndeterminate} from '../../components';
// import {globalStyles} from '../../utils/styleConstants';

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const GroupSettings = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
		isAdmin: PropTypes.bool,
		saveStatus: PropTypes.string,
		handleAdminSave: PropTypes.func,
	},

	getDefaultProps: function() {
		
	},

	// saveSettings: function() {
	// 	const newDetails = {
	// 		name: this.refs.name.value,
	// 		title: this.refs.title.value,
	// 		bio: this.refs.bio.value,
	// 	};
	// 	this.props.handleSettingsSave(newDetails);
	// },

	render: function() {
		return (
			<div style={styles.container}>
				<div>GROUP SETTINGS</div>

			</div>
		);
	}
});

export default Radium(GroupSettings);

styles = {

};
