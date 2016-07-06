import React, {PropTypes} from 'react';
import Radium from 'radium';
import {MarkdownEditor, ImageEditor} from 'components/AtomTypes' ;
import {safeGetInToJS} from 'utils/safeParse';

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

		const type = safeGetInToJS(this.props.atomEditData, ['atomData', 'type']);
		switch (type) {
		case 'markdown': 
			return <MarkdownEditor {...props} loginData={this.props.loginData} />;
		case 'image': 
			return <ImageEditor {...props} />;
		default: 
			return <div>Unknown Type</div>;
		}
	}
});

export default Radium(AtomEditorPane);

