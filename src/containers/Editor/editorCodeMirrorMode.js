/* global CodeMirror */

export default function() {

	CodeMirror.registerHelper('hint', 'plugins', function(editor, options) {
		try {
			const cur = editor.getCursor();
			const token = editor.getTokenAt(cur);
			const end = cur.ch;
			// console.log(token);

			if (token.type === 'pubpub-markdown') {
				// const list = ['asset', 'image', 'title', 'audio', 'video', 'table'];
				const list = [
					{text: 'video: ]', displayText: 'video'},
					{text: 'image: ]', displayText: 'image'}];

				const line = editor.getLine(cur.line);
				let startPos = token.start;
				let char = line.charAt(startPos);
				while (char !== '[' && startPos > 0) {
					startPos--;
					char = line.charAt(startPos);
				}

				return {list: list, from: CodeMirror.Pos(cur.line, startPos + 1), to: CodeMirror.Pos(cur.line, token.end)};
			}
			// } else {
			// 	return null;
			// }
		} catch (err) {
			console.warn(err);
		}
		return null;
	});

	CodeMirror.defineSimpleMode('plugin', {
		start: [
			// {regex: /\[/, token: 'plugin-start',next:'pluginStart'}
			{regex: /\[title.*\]/, token: 'ppm ppm-title'},
			{regex: /\[abstract.*\]/, token: 'ppm ppm-abstract'},
			{regex: /\[authorsNote.*\]/, token: 'ppm ppm-authorsNote'},
			{regex: /\[cite.*\]/, token: 'ppm ppm-cite'},
			// {regex: /\[asset.*\]/, token: 'plugin plugin-asset'},
			{regex: /\[image:.*/, token: 'plugin plugin-image', next: 'pluginStart'},
			{regex: /\[video.*\]/, token: 'plugin plugin-video'},
			{regex: /\[audio.*\]/, token: 'plugin plugin-audio'},
			{regex: /\[table.*\]/, token: 'plugin plugin-table'},
		],
		pluginStart: [
			// {regex: /.*/, token: 'plugin-content'},
			{regex: /\]/, token: 'plugin-end', next: 'start'}
		]
	});

	CodeMirror.defineMode('pubpubmarkdown', function(config) {
		return CodeMirror.multiplexingMode(
			CodeMirror.getMode(config, 'markdown'),
			{open: '[', close: ']',
			 mode: CodeMirror.getMode(config, 'plugin'),
			 innerStyle: 'pubpub-markdown',
		 	 parseDelimiters: true}
		);
	});
}
