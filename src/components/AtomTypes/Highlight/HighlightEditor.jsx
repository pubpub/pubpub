import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const HighlightEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},


	getSaveVersionContent: function() {
		// return this.state.HighlightData;
	},


	render: function() {
		return (
			<div style={styles.container}>
				
				Highlight Editor

			</div>
		);
	}
});

export default Radium(HighlightEditor);

styles = {
	
};
