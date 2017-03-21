/* eslint-disable no-param-reassign */
import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import MDReactComponent from './ReactMarkdownMD';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import mk from 'markdown-it-katex';
import katex from 'katex';
// import { parseString } from 'bibliography';
// import AMA from 'bibliography/AMA';

import RenderFile from './RenderFile';

let styles;

// function fileParser(state, silent) {
// 	let token;
// 	const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;
// 	const max = state.posMax;
// 	const start = state.pos;

// 	if (state.src.charAt(start) !== '!') { return false; }
// 	if (silent) { return false; } // don't run any pairs in validation mode
// 	if (state.src.charAt(start + 1) === '[') { return false; }
// 	if (start + 2 >= max) { return false; }

// 	state.pos = start + 1;
// 	while (state.pos < max) {
// 		if (state.src.charAt(state.pos) === ' ') { break; }
// 		state.pos += 1;
// 	}

// 	if (start + 1 === state.pos) { state.pos = start; return false; }

// 	const content = state.src.slice(start + 1, state.pos);
// 	if (content.match(/(^|[^\\])(\\\\)*[\n]/)) { state.pos = start; return false; }

// 	state.posMax = state.pos;
// 	state.pos = start + 1;

// 	// Earlier we checked !silent, but this implementation does not need it
// 	token = state.push('file_open', 'file', 1);
// 	token.markup = '!';

// 	token = state.push('text', '', 0);
// 	token.content = content.replace(UNESCAPE_RE, '$1');

// 	token = state.push('file_close', 'file', -1);
// 	token.markup = '!';
	
// 	state.pos = state.posMax + 1;
// 	state.posMax = max;
// 	return true;
// }

// function mentionParser(state, silent) {
// 	let token;
// 	const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;
// 	const max = state.posMax;
// 	const start = state.pos;

// 	if (state.src.charAt(start) !== '@') { return false; }
// 	if (silent) { return false; } // don't run any pairs in validation mode
// 	if (start + 2 >= max) { return false; }

// 	state.pos = start + 1;
// 	while (state.pos < max) {
// 		if (state.src.charAt(state.pos) === ' ') { break; }
// 		state.pos += 1;
// 	}

// 	if (start + 1 === state.pos) { state.pos = start; return false; }

// 	const content = state.src.slice(start + 1, state.pos);
// 	if (content.match(/(^|[^\\])(\\\\)*[\n]/)) { state.pos = start; return false; }

// 	state.posMax = state.pos;
// 	state.pos = start + 1;

// 	// Earlier we checked !silent, but this implementation does not need it
// 	token = state.push('mention_open', 'mention', 1);
// 	token.markup = '@';

// 	token = state.push('text', '', 0);
// 	token.content = content.replace(UNESCAPE_RE, '$1');

// 	token = state.push('mention_close', 'mention', -1);
// 	token.markup = '@';
	
// 	state.pos = state.posMax + 1;
// 	state.posMax = max;
// 	return true;
// }

function highlightParser(state, silent) {
	let token;
	const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;
	const max = state.posMax;
	const start = state.pos;

	// if (state.src.charAt(start) !== '[') { return false; }
	if (state.src.substring(0, 12) !== '[@highlight/') { return false; }
	if (silent) { return false; } // don't run any pairs in validation mode
	if (start + 2 >= max) { return false; }

	state.pos = start + 1;
	while (state.pos < max) {
		if (state.src.charAt(state.pos) === ']') { break; }
		state.pos += 1;
	}

	if (start + 1 === state.pos) { state.pos = start; return false; }

	const content = state.src.slice(start + 1, state.pos);
	if (content.match(/(^|[^\\])(\\\\)*[\n]/)) { state.pos = start; return false; }

	state.posMax = state.pos;
	state.pos = start + 1;

	// Earlier we checked !silent, but this implementation does not need it
	token = state.push('highlight_open', 'highlight', 1);

	token = state.push('text', '', 0);
	token.content = content.replace(UNESCAPE_RE, '$1');

	token = state.push('highlight_close', 'highlight', -1);
	
	state.pos = state.posMax + 1;
	state.posMax = max;
	return true;
}

export const RenderFileMarkdown = React.createClass({
	propTypes: {
		file: PropTypes.object,
		allFiles: PropTypes.array,
		pubSlug: PropTypes.string,
		query: PropTypes.object,
	},

	getInitialState() {
		return {
			highlights: [],
		};
	},

	componentWillMount() {
		this.setHighlights(this.props.allFiles);
	},

	componentWillReceiveProps(nextProps) {
		const prevFile = this.props.file;
		const nextFile = nextProps.file;
		if (prevFile.id && nextFile.id && prevFile.id !== nextFile.id) {
			this.setHighlights(nextProps.allFiles);
		}
	},

	setHighlights(allFiles) {
		const highlightsFile = allFiles.reduce((previous, current)=> {
			if (current.name === 'highlights.json') { return current; }
			return previous;
		}, undefined);

		if (highlightsFile) {
			this.setState({ highlights: JSON.parse(highlightsFile.content) });	
		}
	},

	handleIterate: function(Tag, props, children, level) {
		// if (Tag === 'file') {
		// 	const allFiles = this.props.allFiles || [];
		// 	const file = allFiles.reduce((previous, current)=> {
		// 		if (current.name === children[0]) { return current; }
		// 		return previous;
		// 	}, undefined);
		// 	if (file) {
		// 		return <RenderFile file={file} allFiles={this.props.allFiles} />;	
		// 	}
		// }
		if (Tag === 'highlight') {
			const child = children[0] || '';
			const highlightId = child.replace('@highlight/', '');
			const highlights = this.state.highlights || [];
			const highlightObject = highlights.reduce((previous, current)=> {
				if (String(current.id) === highlightId) { return current; }
				return previous;
			}, undefined);
			if (highlightObject) {
				const addHover = function() {
					const elements = document.getElementsByClassName(`highlight-${highlightId}`);
					for (let index = 0; index < elements.length; index++) {
						const element = document.getElementsByClassName(`highlight-${highlightId}`)[index];
						if (element) {
							element.className += ' highlight-hover';	
						}	
					}
					
					
				};
				const removeHover = function() {
					const elements = document.getElementsByClassName(`highlight-${highlightId}`);
					for (let index = 0; index < elements.length; index++) {
						const element = document.getElementsByClassName(`highlight-${highlightId}`)[index];
						if (element) {
							element.className = element.className.replace(' highlight-hover', '');
						}	
					}
				};
				const scrollToHighlight = function() {
					const element = document.getElementsByClassName(`highlight-${highlightId}`)[0];
					if (element) {
						const top = element.getBoundingClientRect().top;
						window.scrollBy({ top: top - 50, behavior: 'smooth' });
					}
				};

				return (
					<span style={styles.highlightWrapper} onMouseEnter={addHover} onMouseLeave={removeHover} onClick={scrollToHighlight}>
						<span style={styles.highlightContext}>{highlightObject.prefix}</span>
						<span style={styles.highlightText}>{highlightObject.exact}</span>
						<span style={styles.highlightContext}>{highlightObject.suffix}</span>
					</span>
				);
			}
			return <span>[{child} - not found]</span>;
		}

		if (Tag === 'img') {
			const allFiles = this.props.allFiles || [];
			const file = allFiles.reduce((previous, current)=> {
				if (current.name === props.src) { return current; }
				return previous;
			}, undefined);
			if (file) {
				return <RenderFile file={file} allFiles={this.props.allFiles} />;	
			}
			return <Tag {...props} />;
		}
		if (Tag === 'a') {
			const allFiles = this.props.allFiles || [];
			const file = allFiles.reduce((previous, current)=> {
				if (current.name === props.href) { return current; }
				return previous;
			}, undefined);
			if (file) {
				return <Link to={{ pathname: `/pub/${this.props.pubSlug}/files/${file.name}`, query: this.props.query }}>{children[0]}</Link>;	
			}
		}
		// if (Tag === 'mention') {
		// 	// const allFiles = this.props.allFiles || [];
		// 	// return allFiles.reduce((previous, current)=> {
		// 	// 	if (current.type !== 'application/x-bibtex' && current.url && current.url.split('.').pop() !== 'bib') { return previous; }
		// 	// 	const bibliography = parseString(current.content);
		// 	// 	const currentKey = children[0].split('ref/')[1];
		// 	// 	return <AMA entry={bibliography.entries[currentKey.toLowerCase()]} />;
		// 	// }, undefined);
		// 	const allFiles = this.props.allFiles || [];
		// 	const file = allFiles.reduce((previous, current)=> {
		// 		if (current.name === children[0]) { return current; }
		// 		return previous;
		// 	}, undefined);
		// 	if (file) {
		// 		return <Link to={{ pathname: `/pub/${this.props.pubSlug}/files/${file.name}`, query: this.props.query }}>{file.name}</Link>;	
		// 	}
		// }
		if (Tag === 'hr' || Tag === 'br') { return <Tag {...props} />; }
		if (Tag === 'math') {
			try {
				if (props['data-type'] === 'math_block') {
					return <p><math dangerouslySetInnerHTML={{ __html: katex.renderToString(props['data-content']) }} /></p>;	
				}
				return <math dangerouslySetInnerHTML={{ __html: katex.renderToString(props['data-content']) }} />;
			} catch (err) {
				return null;
			}
		}
		return <Tag {...props} children={children} />;
	},

	// filePlugin: function(md) {
	// 	md.inline.ruler.push('file', fileParser);
	// },

	// mentionPlugin: function(md) {
	// 	md.inline.ruler.push('mention', mentionParser);
	// },

	highlightPlugin: function(md) {
		md.inline.ruler.push('highlight', highlightParser);
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
					linkify: false,
				}}
				className={'pub-article'}
				plugins={[
					sub,
					sup,
					mk,
					// this.filePlugin,
					// this.mentionPlugin,
					this.highlightPlugin,
				]} /> 
		);
	}

});

export default Radium(RenderFileMarkdown);

styles = {
	highlightWrapper: {
		display: 'block',
		margin: '1em 0em',
		padding: '0.5em',
		boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)',
		fontWeight: 400,
		fontFamily: '"Merriweather", serif',
	},
	highlightContext: {
		opacity: 0.5,
	},
};