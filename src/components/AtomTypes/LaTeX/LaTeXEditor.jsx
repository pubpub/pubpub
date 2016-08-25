import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import katex from 'katex';
import katexStyles from './katex.css.js';

let styles = {};

export const LaTeXEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	getInitialState() {
		return {
			text: '',
			inlineHTML: '',
			displayHTML: ''
		};
	},

	componentWillMount() {
		const text = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'text']) || '';
		const html = this.generateHTML(text);
		this.setState({text, ...html});
	},

	getSaveVersionContent: function() {
		const {text, inlineHTML, displayHTML} = this.state;
		return {text, inlineHTML, displayHTML};
	},
	
	generateHTML(text) {
		const inlineHTML = katex.renderToString(text, {displayMode: false, throwOnError: false});
		const displayHTML = katex.renderToString(text, {displayMode: true, throwOnError: false});
		return {inlineHTML, displayHTML};
	},
	
	updateText: function(evt) {
		const text = evt.target.value;
		const html = this.generateHTML(text);
		this.setState({text, ...html});
	},

	render: function() {
		const {text, inlineHTML, displayHTML} = this.state;
		return (
			<div style={styles.container}>
				<h3>Preview</h3>
				<Style rules={ katexStyles } />
				<div dangerouslySetInnerHTML={{__html: displayHTML}} style={styles.output}></div>
				<textarea value={text} onChange={this.updateText} style={styles.input}/>
			</div>
		);
	}
});

export default Radium(LaTeXEditor);

styles = {
	container: {
		width: '100%'
	},
	input: {
		width: '100%',
		minHeight: '100px',
	},
	output: {
		width: '100%'
	}
};
