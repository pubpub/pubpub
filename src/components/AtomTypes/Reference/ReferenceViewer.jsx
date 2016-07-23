import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Reference} from 'components';

let styles;

export const ImageViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
		citeCount: PropTypes.number,
	},

	render: function() {

		const referenceData = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']);
		const number = this.props.citeCount || '?';

		switch (this.props.renderType) {
		case 'full':
		case 'static-full':
			return (
				<div>
					<Reference citationObject={referenceData}/>
				</div>
			);
		case 'embed':
		case 'static-embed':
		default:
			return (
				<span className={'showChildOnHover'} style={styles.refWrapper}>
					[{number}]
					<div className={'hoverCh2ild'} style={styles.hoverBox}><Reference citationObject={referenceData}/></div>
				</span>
			);
		}

	}
});

export default Radium(ImageViewer);

styles = {
	refWrapper: {
		position: 'relative',
	},
	hoverBox: {
		border: '1px solid #BBBDC0',
		width: '350px',
		backgroundColor: 'white',
		position: 'absolute',
		left: '.5em',
		top: '-2em',
		fontSize: '0.75em',
		lineHeight: '1em',
		zIndex: 1,
		boxShadow: '0px 1px 5px #808284',
		padding: '1em',
	},
};
