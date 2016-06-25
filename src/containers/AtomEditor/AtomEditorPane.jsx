import React, {PropTypes} from 'react';
import Radium from 'radium';
import {MarkdownEditor, ImageEditor} from 'components/AtomTypes' ;

export const AtomEditorPane = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	render: function() {
		switch (this.props.atomEditData.getIn(['atomData', 'type'])) {
		case 'markdown': 
			return <MarkdownEditor ref={'editor'} atomEditData={this.props.atomEditData} />;
		case 'image': 
			return <ImageEditor ref={'editor'} atomEditData={this.props.atomEditData} />;
		default: 
			return null;
		}
	}
});

export default Radium(AtomEditorPane);

