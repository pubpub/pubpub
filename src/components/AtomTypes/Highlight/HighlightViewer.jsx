import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';


let styles;

export const HighlightViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
		citeCount: PropTypes.number,
	},

	render: function() {

		const highlightData = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']);
		const number = this.props.citeCount || '?';

		switch (this.props.renderType) {
		case 'full':
		case 'static-full':
			return (
				<div>
					{JSON.stringify(highlightData)}
				</div>
			);
		case 'embed':
		case 'static-embed':
		default:
			return (
				<span >
					{JSON.stringify(highlightData)}
				</span>
			);
		}

	}
});

export default Radium(HighlightViewer);

styles = {
	
};
