import React, {PropTypes} from 'react';
import Radium from 'radium';
import {MarkdownViewer, ImageViewer} from 'components/AtomTypes' ;

export const AtomViewerPane = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		switch (this.props.atomData.getIn(['atomData', 'type'])) {
		case 'markdown': 
			return <MarkdownViewer atomData={this.props.atomData} />;
		case 'image': 
			return <ImageViewer atomData={this.props.atomData} />;
		default: 
			return null;
		}
	}
});

export default Radium(AtomViewerPane);

