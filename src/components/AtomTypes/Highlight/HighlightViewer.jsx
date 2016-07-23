import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

export const HighlightViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {

		const highlightData = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']);

		switch (this.props.renderType) {
		case 'full':
		case 'static-full':
		case 'embed':
		case 'static-embed':
		default:
			return (
				<div>
					{JSON.stringify(highlightData)}
				</div>
			);
		}
	}
});

export default Radium(HighlightViewer);
