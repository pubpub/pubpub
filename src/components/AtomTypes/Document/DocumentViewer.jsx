import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {renderReactFromJSON} from './proseEditor';

export const DocumentViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {
		const docJSON = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'docJSON']);

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <div>Embedded document!</div>;
		case 'full':
		case 'static-full':
		default:
			return <div className={'document-body'}>{renderReactFromJSON(docJSON && docJSON.content, true)}</div>;
		}

	}
});

export default Radium(DocumentViewer);
