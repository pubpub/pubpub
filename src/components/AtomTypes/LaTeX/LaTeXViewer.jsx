import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const LaTeXViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {
		const inlineHTML = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'inlineHTML']) || '';
		const displayHTML = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'displayHTML']) || '';
		
		switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
				return <div dangerouslySetInnerHTML={{__html: displayHTML}}></div>
			case 'full':
			case 'static-full':
			default:
				return <div dangerouslySetInnerHTML={{__html: inlineHTML}}></div>
		}
	}
});

export default Radium(LaTeXViewer);

styles = {
	
};
