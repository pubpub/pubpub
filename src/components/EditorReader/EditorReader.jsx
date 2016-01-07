import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

// import {FormattedMessage} from 'react-intl';

let styles = {};

const EditorReader = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		isAuthor: PropTypes.bool,

		discussionsData: PropTypes.array,
		commentsData: PropTypes.array,

		
		// PubBodyData
		status: PropTypes.string
		title: PropTypes.string
		abstract: PropTypes.string
		authorsNote: PropTypes.string
		minFont: PropTypes.number
		htmlTree: PropTypes.array
		authors: PropTypes.array
		style: PropTypes.object
		references: PropTypes.array
		isFeatured: PropTypes.bool
	},

	getDefaultProps: function() {
		
	},

	render: function() {
		return (
			<div style={styles.container}>
				// Nav
				// Line

				// if isAuthor - single pane mode
				// else doublePane mode - unless mobile and then single pane mode

				// Switch mode: 

				EditorReader

				

			</div>
		);
	}
});

export default Radium(EditorReader);

styles = {
	singlePane: {
		// show nav
		// put discussions on top of editor
	},
	singlePaneMobile: {
		// show nav
	},
};
