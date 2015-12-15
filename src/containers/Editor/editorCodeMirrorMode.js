/* global CodeMirror */

import plugins from '../../components/EditorPlugins/index.js';

export default function() {

	CodeMirror.registerHelper('hint', 'plugins', function(editor) { // (editor,options)

		let result = null;
		try {
			const cur = editor.getCursor();
			const token = editor.getTokenAt(cur);

			if (token.type === 'pubpub-markdown') {
				// const list = ['asset', 'image', 'title', 'audio', 'video', 'table'];
				const list = [];

				for (const plugin in plugins) {
					if (plugins.hasOwnProperty(plugin) && plugins[plugin].autocomplete === true) {
						list.push({text: plugin + ': ]', displayText: plugin});
					}
				}

				const line = editor.getLine(cur.line);
				let startPos = token.start;
				let char = line.charAt(startPos);
				while (char !== '[' && startPos > 0) {
					startPos--;
					char = line.charAt(startPos);
				}
				if (token.end - startPos <= 8) {
					result = {list: list, from: CodeMirror.Pos(cur.line, startPos + 1), to: CodeMirror.Pos(cur.line, token.end)};
				}
			}
			// } else {
			// 	return null;
			// }
		} catch (err) {
			console.warn(err);
		}
		return result;
	});

	CodeMirror.defineSimpleMode('plugin', {
		start: [
			{regex: /\[title:.*\]/, token: 'ppm ppm-title'},
			{regex: /\[abstract:.*\]/, token: 'ppm ppm-abstract'},
			{regex: /\[authorsNote:.*\]/, token: 'ppm ppm-authorsNote'},
			{regex: /\[pagebreak\]/, token: 'ppm ppm-pagebreak'},
			// {regex: /\[asset.*\]/, token: 'plugin plugin-asset'},
			{regex: /\[image:.*\]/, token: 'ppm plugin plugin-image'},
			{regex: /\[video:.*\]/, token: 'ppm plugin plugin-video'},
			{regex: /\[audio:.*\]/, token: 'ppm plugin plugin-audio'},
			{regex: /\[table:.*\]/, token: 'ppm plugin plugin-table'},
			{regex: /\[cite:.*\]/, token: 'ppm plugin plugin-cite'},
		],
		citationStart: [
			// {regex: /.*/, token: 'plugin-content'},
			{regex: /.*\]/, token: 'ppm ppm-cite', next: 'start'}
		]
	});

	CodeMirror.defineSimpleMode('math', {
		start: [
			{regex: /.*/, token: 'ppm ppm-math string'}
		]
	});

	CodeMirror.defineMode('pubpubmarkdown', function(config) {
		return CodeMirror.multiplexingMode(
			CodeMirror.getMode(config, 'markdown'),
			{open: '[', close: ']',
			 mode: CodeMirror.getMode(config, 'plugin'),
			 innerStyle: 'pubpub-markdown',
		 	 parseDelimiters: true},
			 {open: '$', close: '$',
 			 mode: CodeMirror.getMode(config, 'math'),
 			 innerStyle: 'pubpub-math',
 		 	 parseDelimiters: false}


		);
	});
}
