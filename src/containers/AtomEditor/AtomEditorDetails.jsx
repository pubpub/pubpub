import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const AtomEditorDetails = React.createClass({
	propTypes: {
		isLoading: PropTypes.bool,
	},

	render: function() {
		return (
			<div>
				<h2>Details</h2>
				
			</div>
		);
	}
});

export default Radium(AtomEditorDetails);

styles = {
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
};
