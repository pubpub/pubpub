import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Loader, CustomizableForm} from 'components';
import Select from 'react-select';
import request from 'superagent';

import CodeMirrorStyles from './codemirror.css';
import MonokaiTheme from './monokai.css';
import DraculaTheme from './dracula.css';
import EclipseTheme from './eclipse.css';
import MaterialTheme from './material.css';

const Themes = {...MonokaiTheme, ...DraculaTheme, ...EclipseTheme, ...MaterialTheme};

import CodeMirror from 'react-codemirror';

if (typeof window !== 'undefined') {
	require('codemirror/mode/css/css');
	require('codemirror/mode/go/go');
	require('codemirror/mode/haskell/haskell');
	require('codemirror/mode/htmlmixed/htmlmixed');
	require('codemirror/mode/javascript/javascript');
	require('codemirror/mode/julia/julia');
	require('codemirror/mode/python/python');
	require('codemirror/mode/r/r');
	require('codemirror/mode/rust/rust');
	require('codemirror/mode/scheme/scheme');
	require('codemirror/mode/xml/xml');

	require('codemirror/addon/edit/matchtags');
	require('codemirror/addon/edit/closetag');
	require('codemirror/addon/edit/matchbrackets');
	require('codemirror/addon/edit/closebrackets');
	require('codemirror/keymap/sublime');
}

let styles = {};

const extensions = {
	scm: 'scheme',
	js: 'javascript',
	json: 'javascript',
	py: 'python',
	xml: 'xml',
	rst: 'rust',
	r: 'r',
	jl: 'julia',
	html: 'htmlmixed',
	hs: 'haskell',
	lhs: 'haskell',
	go: 'go'
};

const mimes = {
	'application/json': 'json',
	'text/javascript': 'javascript',
};

const languages = {
	JSON: 'javascript',
	Python: 'python',
	JavaScript: 'javascript',
	Scheme: 'scheme',
	XML: 'xml',
	Rust: 'rust',
	R: 'r',
	Julia: 'julia',
	HTML: 'htmlmixed',
	Haskell: 'haskell',
	Go: 'go'
};

export const CodeEditor = React.createClass({
	
	propTypes: {
		atomEditData: PropTypes.object 
	},

	getInitialState() {
		return {
			code: '',
			theme: 'default',
			mode: 'default', 
			gist: false,
			modeOptions: [
				{value: 'default', label: 'Text'},
				{value: 'javascript', label: 'JavaScript'},
				{value: 'python', label: 'Python'},
				{value: 'scheme', label: 'Scheme'},
				{value: 'haskell', label: 'Haskell'},
				{value: 'xml', label: 'XML'},
				{value: 'rust', label: 'Rust'},
				{value: 'r', label: 'R'},
				{value: 'htmlmixed', label: 'HTML'},
				{value: 'julia', label: 'Julia'},
				{value: 'go', label: 'Go'}
			],
			themeOptions: [
				{value: 'default', label: 'Default'},
				{value: 'monokai', label: 'Monokai'},
				{value: 'dracula', label: 'Dracula'},
				{value: 'material', label: 'Material'},
				{value: 'eclipse', label: 'Eclipse'}
			],
			gistOptions: []
		};
	},

	componentWillMount() {
		const code = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'code']) || '';
		const mode = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'mode']) || 'default';
		const theme = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'theme']) || 'default';
		this.setState({code, mode, theme});
	},
	
	getSaveVersionContent() {
		const {code, theme, mode} = this.state;
		return {code, theme, mode};
	},

	handleFileSelect: function(evt) {
		
		if (evt.target.files.length) {
			const file = evt.target.files[0];
			if (file.name) {
				const extension = file.name.split('.').slice(-1)[0].toLowerCase();
				const mode = extensions[extension] || 'default';
				const reader = new FileReader();
				reader.onload = event => event.target.result && this.setState({code: event.target.result, mode});
				reader.readAsText(file);
			}
		}
	},
	
	updateCode(code) {
		this.setState({code}); 
	},
	
	updateTheme({value}) {
		this.setState({theme: value});
	},
	
	updateKeyMap({value}) {
		this.setState({mode: value});
	},
	
	updateURL(evt) {
		const url = evt.target.value;
		const regex = /^https?:\/\/gist\.github\.com\/[^\/]+\/.{32}$/;
		if (regex.test(url)) this.loadGistFromId(url.substring(url.lastIndexOf('/') + 1));
		else if (url.length === 32) this.loadGistFromId(url);
	},
	
	loadGistFromId(id) {
		const source = 'https://api.github.com/gists/' + id;
		console.log(source);
		request.get(source).end((err, res) => {
			if (err) console.error(err);
			else if (res.body && res.body.files) {
				const files = res.body.files, fileNames = Object.keys(files), fileName = fileNames[0], file = files[fileName];
				this.setState({
					gistOptions: fileNames.map(name => ({...res.body.files[name], label: name, value: name})),
					gist: fileName,
					code: file.content,
					mode: languages[file.language] || mimes[file.type] || extensions[fileName.substring(fileName.lastIndexOf('.') + 1)] || 'default'
				});
			}
		});
	},
	
	updateGist(file) {
		const fileName = file.filename;
		this.setState({
			gist: fileName,
			code: file.content,
			mode: languages[file.language] || mimes[file.type] || extensions[fileName.substring(fileName.lastIndexOf('.') + 1)] || 'default'
		});
	},

	render() {
		const {mode, theme, code, modeOptions, themeOptions, gistOptions, gist} = this.state;
		const options = {
			mode, theme,
			matchTags: true,
			autoCloseTags: true,
			autoCloseBrackets: true,
			autoMatchParens: true,
			matchBrackets: true,
			keyMap: 'sublime',
		};
		
		const SelectTheme = {
			'.Select-menu-outer': {
				zIndex: 1000
			}
		};
		
		return <div>
			
			<div style={styles.settings}>
				<label htmlFor='mode' style={styles.label}>
					Mode:
					<Select name='mode' id='mode' value={mode} options={modeOptions} onChange={this.updateKeyMap} />
				</label>
				<label htmlFor="theme" style={styles.label}>
					Theme:
					<Select name='theme' id='theme' value={theme} options={themeOptions} onChange={this.updateTheme} />
				</label>
				<label htmlFor='url' style={styles.label}>
					GitHub Gist:
					<input id='url' name='url' type='text' onChange={this.updateURL} />
				</label>
				<Select name='gist' id='gist' value={gist} style={{display: gistOptions.length > 0 ? 'table' : 'none'}}
												options={gistOptions} onChange={this.updateGist} />
				<label htmlFor='file' style={styles.label}>
					Upload File:
					<input id='file' name='file' type='file' accept='*' onChange={this.handleFileSelect} />
				</label>
			</div>
			
			<Style rules={{...CodeMirrorStyles, ...Themes, ...SelectTheme}} />
			
			<div style={styles.code}>
				<CodeMirror value={code} onChange={this.updateCode} options={options}/>
			</div>
			
		</div>;
	}
});

export default Radium(CodeEditor);

styles = {
	label: {
		fontSize: '1.1em',
		marginTop: 8
	},
	code: {
		border: '2px solid #BBBDC0',
		textAlign: 'left',
		lineHeight: '1.2',
		fontSize: 16
	},
	settings: {
		zIndex: 1000
	}
};
