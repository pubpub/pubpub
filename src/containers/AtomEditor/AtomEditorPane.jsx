import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {MarkdownEditor, ImageEditor, JupyterEditor} from 'components/AtomTypes' ;
import AtomTypes from 'components/AtomTypes';
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
		if (AtomTypes.hasOwnProperty(type)) {
			return React.createElement(AtomTypes[type].editor, {...props, loginData: this.props.loginData});
		} else {
			return <div>Unknown Type</div>;
		}
		// switch (type) {
		// case 'markdown':
		// 	return <MarkdownEditor {...props} loginData={this.props.loginData} />;
		// case 'image':
		// 	return <ImageEditor {...props} />;
		// case 'jupyter':
		// 	return <JupyterEditor {...props} />;
		// default:
		// 	return <div>Unknown Type</div>;
		// }
	}
});

export default Radium(AtomEditorPane);
