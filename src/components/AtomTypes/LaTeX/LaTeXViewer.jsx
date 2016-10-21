import katex from 'katex';
import Radium, {Style} from 'radium';
import React, {PropTypes} from 'react';
import {safeGetInToJS} from 'utils/safeParse';

import katexStyles from './katex.css.js';

let styles;

export const LaTeXViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	generateHTML(text) {
		const inlineHTML = katex.renderToString(text, {displayMode: false, throwOnError: false});
		const displayHTML = katex.renderToString(text, {displayMode: true, throwOnError: false});
		return {inlineHTML, displayHTML};
	},

	getData() {
		const text = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'text']) || '';
		const inlineHTML = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'inlineHTML']);
		const displayHTML = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'displayHTML']);

		if (inlineHTML && displayHTML) {
			return {text, inlineHTML, displayHTML};
		}
		return {text, ...this.generateHTML(text)};
	},

	render: function() {
		try {
			const {displayHTML, inlineHTML} = this.getData();
			switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
				return (<div>
					<Style rules={ katexStyles } />
					<div dangerouslySetInnerHTML={{__html: displayHTML}}></div>
				</div>);
			case 'full':
			case 'static-full':
			default:
				return (<div>
					<Style rules={ katexStyles } />
					<div dangerouslySetInnerHTML={{__html: inlineHTML}}></div>
				</div>);
			}
		} catch (err) {
			return (<div>ERROR: rendering latex equation</div>);
		}
	}
});

export default Radium(LaTeXViewer);

styles = {

};
