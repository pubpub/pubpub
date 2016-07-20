import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles = {};
const defaultHeight = '300';
const defaultWidth = '100%';

export const IFrameViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render() {

		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const source = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'source']) || '';
		const height = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'height']) || defaultHeight;
		const width = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'width']) || defaultWidth;

		switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
			case 'full':
			case 'static-full':
			default:
				return <iframe src={source} style={styles.iframe(height, width)}></iframe>;
		}
	}
});

export default Radium(IFrameViewer);

styles = {
	iframe: (height, width) => ({height, width})
};
