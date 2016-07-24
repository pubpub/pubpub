import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles;
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
			console.log(highlightData);
			return (
				<div style={styles.selectionBlock}>
					{highlightData.text}
				</div>
			);
		}
	}
});

export default Radium(HighlightViewer);

styles = {
	selectionBlock: {
		borderRadius: '1px',
		padding: '10px 8px',
		color: '#5B5B5B',
		cursor: 'pointer',
		margin: '5px 0px 15px 0px',
		fontStyle: 'italic',
		fontSize: '0.9em',
	},
};
