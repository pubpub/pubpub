import React, {PropTypes} from 'react';
import Radium from 'radium';
import {MarkdownEditor, ImageEditor} from 'components/AtomTypes' ;

export const AtomEditorPane = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	render: function() {
		const props = {
			ref: 'editor',
			atomEditData: this.props.atomEditData
		};

		switch (this.props.atomEditData.getIn(['atomData', 'type'])) {
		case 'markdown': 
			return <MarkdownEditor {...props} loginData={this.props.loginData} />;
		case 'image': 
			return <ImageEditor {...props} />;
		default: 
			return null;
		}
	}
});

export default Radium(AtomEditorPane);

