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
			atomEditData: this.props.atomEditData,
			loginData: this.props.loginData
		};

		const type = safeGetInToJS(this.props.atomEditData, ['atomData', 'type']);
		if (AtomTypes.hasOwnProperty(type)) {
			const Component = AtomTypes[type].editor;
			return <Component {...props} />;
			// return React.createElement(AtomTypes[type].editor, {...prop});
		}
		
		return <div>Unknown Type</div>;

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
