import React, {PropTypes} from 'react';
import Radium from 'radium';

export const AtomReaderExport = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {

		return (
			<div>
				
				<h2>Export</h2>
				
				<h3>Download Markdown</h3>
				<h3>Download PDF</h3>
				<h3>Download XML</h3>
			</div>
		);
	}
});

export default Radium(AtomReaderExport);
