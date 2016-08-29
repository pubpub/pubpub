import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const HighlightEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},


	getSaveVersionContent: function() {
		// return this.state.HighlightData;
	},


	render: function() {
		return (
			<div style={styles.container}>
				<FormattedMessage id="about.HighlightEditor" defaultMessage="Highlight Editor"/>
			</div>
		);
	}
});

export default Radium(HighlightEditor);

styles = {

};
