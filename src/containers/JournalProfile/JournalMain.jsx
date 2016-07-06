import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const JournalMain = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			journalData: {},
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				Main
				
			</div>
		);
	}
});

export default Radium(JournalMain);

styles = {
	sectionHeader: {
		fontSize: '25px',
		margin: '15px 0px',
	},
};
