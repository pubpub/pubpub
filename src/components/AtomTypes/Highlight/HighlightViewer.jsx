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
		padding: '1em',
		color: '#5B5B5B',
		cursor: 'pointer',
		margin: '0.25em 0em 1em 0em',
		fontStyle: 'italic',
		fontSize: '0.85em',
		boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)',
		backgroundColor: 'rgba(255,255,255,0.65)',
	},
};
