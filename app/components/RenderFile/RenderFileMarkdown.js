/* eslint-disable no-param-reassign */
import React, { PropTypes } from 'react';
import Radium from 'radium';
import MDReactComponent from 'markdown-react-js';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import RenderFile from './RenderFile';

function fileParser(state, silent) {
	let token;
	const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;
	const max = state.posMax;
	const start = state.pos;

	if (state.src.charAt(start) !== '!') { return false; }
	if (silent) { return false; } // don't run any pairs in validation mode
	if (state.src.charAt(start + 1) === '[') { return false; }
	if (start + 2 >= max) { return false; }

	state.pos = start + 1;
	while (state.pos < max) {
		if (state.src.charAt(state.pos) === ' ') { break; }
		state.pos += 1;
	}

	if (start + 1 === state.pos) { state.pos = start; return false; }

	const content = state.src.slice(start + 1, state.pos);
	if (content.match(/(^|[^\\])(\\\\)*[\n]/)) { state.pos = start; return false; }

	state.posMax = state.pos;
	state.pos = start + 1;

	// Earlier we checked !silent, but this implementation does not need it
	token = state.push('file_open', 'file', 1);
	token.markup = '!';

	token = state.push('text', '', 0);
	token.content = content.replace(UNESCAPE_RE, '$1');

	token = state.push('file_close', 'file', -1);
	token.markup = '!';
	
	state.pos = state.posMax + 1;
	state.posMax = max;
	return true;
}

export const RenderFileMarkdown = React.createClass({
	propTypes: {
		file: PropTypes.object,
		allFiles: PropTypes.array,
	},

	handleIterate: function(Tag, props, children, level) {
		if (Tag === 'file') {
			const allFiles = this.props.allFiles || [];
			const file = allFiles.reduce((previous, current)=> {
				if (current.name === children[0]) { return current; }
				return previous;
			}, undefined);
			if (file) {
				return <RenderFile file={file} allFiles={this.props.allFiles} />;	
			}
		}
		if (Tag === 'img') { return <Tag {...props} />; }
		return <Tag {...props} children={children} />;
	},

	filePlugin: function(md) {
		md.inline.ruler.push('file', fileParser);
	},
	
	render() {
		const file = this.props.file || {};
		return (
			<MDReactComponent 
				text={file.content}
				onIterate={this.handleIterate}
				markdownOptions={{
					html: false,
					typographer: true,
					linkify: true,
				}}
				plugins={[
					sub,
					sup,
					this.filePlugin
				]} /> 
		);
	}

});

export default Radium(RenderFileMarkdown);
