import React, {PropTypes} from 'react';
import Radium from 'radium';

export const AtomReaderJournals = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {

		return (
			<div>
				
				<h2>Journals</h2>
				
			</div>
		);
	}
});

export default Radium(AtomReaderJournals);
