import React, {PropTypes} from 'react';
import Radium from 'radium';

export const AtomReaderContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {

		return (
			<div>
				
				<h2>Contributors</h2>
				
			</div>
		);
	}
});

export default Radium(AtomReaderContributors);
