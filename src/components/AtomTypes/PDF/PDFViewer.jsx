import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

export const PDFViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {
		const url = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']) || '';

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
		case 'full':
		case 'static-full':
		default:
			return (
				<iframe src={url} style={{height: 'calc(100vh - 80px)', width: '100%'}}></iframe>
			);
		}

	}
});

export default Radium(PDFViewer);
