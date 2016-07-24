import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Reference} from 'components';

export const ReferenceViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {

		const referenceData = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']);

		switch (this.props.renderType) {
		case 'full':
		case 'static-full':
		case 'embed':
		case 'static-embed':
		default:
			return <Reference citationObject={referenceData}/>;
		}
	}
});

export default Radium(ReferenceViewer);
