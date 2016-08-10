import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import CodeMirrorStyles from './codemirror.css';
import MonokaiTheme from './monokai.css';
import DraculaTheme from './dracula.css';
import EclipseTheme from './eclipse.css';
import MaterialTheme from './material.css';

const Themes = {...MonokaiTheme, ...DraculaTheme, ...EclipseTheme, ...MaterialTheme};

import CodeMirror from 'react-codemirror';
if (typeof window !== 'undefined') {
	// TODO: bundle these
	require('codemirror/mode/css/css');
	require('codemirror/mode/go/go');
	require('codemirror/mode/haskell/haskell');
	require('codemirror/mode/htmlmixed/htmlmixed');
	require('codemirror/mode/javascript/javascript');
	require('codemirror/mode/julia/julia');
	require('codemirror/mode/mathematica/mathematica');
	require('codemirror/mode/python/python');
	require('codemirror/mode/r/r');
	require('codemirror/mode/rust/rust');
	require('codemirror/mode/scheme/scheme');
	require('codemirror/mode/xml/xml');
	
	require('codemirror/addon/edit/matchbrackets');
	require('codemirror/addon/edit/closebrackets');
}

let styles = {};

export const CodeViewer = React.createClass({
	propType: {
	atomData: PropTypes.object,
	renderType: PropTypes.oneOf(['full', 'embed', 'static-full', 'static-embed'])
	},
	render() {
		const code = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'code']) || '';
		const mode = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'mode']) || 'default';
		const theme = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'theme']) || 'default';
		
		const options = {
			mode, theme,
			autoCloseBrackets: true,
			autoMatchParens: true,
			matchBrackets: true,
			viewportMargin: Infinity,
			readOnly: true
		};
		
		switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
			case 'full':
			case 'static-full':
			default:
				return <div style={styles.code}>
					<Style rules={{...CodeMirrorStyles, ...Themes}} />
					<CodeMirror value={code} options={options}/>
				</div>
		}
	}
});

export default Radium(CodeViewer);

styles = {
	code: {
		border: '2px solid #BBBDC0',
		textAlign: 'left',
		lineHeight: '1.2',
		fontSize: 16
	},
};
