import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

import CodeMirrorStyles from './codemirror.css';
import MonokaiTheme from './monokai.css';
import DraculaTheme from './dracula.css';
import EclipseTheme from './eclipse.css';
import MaterialTheme from './material.css';

const Styles = {...CodeMirrorStyles, ...MonokaiTheme, ...DraculaTheme, ...EclipseTheme, ...MaterialTheme};

let styles = {};

export const CodeViewer = React.createClass({
	propType: {
	atomData: PropTypes.object,
	renderType: PropTypes.oneOf(['full', 'embed', 'static-full', 'static-embed'])
	},
	render() {
		const code = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'code']) || '';
		// const mode = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'mode']) || 'default';
		const theme = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'theme']) || 'default';
		const html = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'html']) || '';
		
		// const options = {
		// 	mode, theme,
		// 	viewportMargin: Infinity,
		// 	readOnly: true,
		// 	cursorBlinkRate: -1,
		// };
		
		switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
			case 'full':
			case 'static-full':
			default:
				return <div style={styles.code}>
					<Style rules={Styles} />
					<div className={`CodeMirror cm-s-${theme}`} dangerouslySetInnerHTML={{__html: html || code}}></div>
				</div>
		}
	}
});
// <div className="CodeMirror" dangerouslySetInnerHTML={{__html: html}}></div>	
// <CodeMirror value={code} options={options} ref={reactCodeMirror => reactCodeMirror.getCodeMirror().refresh()} />
export default Radium(CodeViewer);

styles = {
	code: {
		textAlign: 'left',
		lineHeight: '1.2',
		fontSize: 16,
		minHeight: 100
	},
};
