/* global CodeMirror */

import Plugins from 'components/Markdown/MarkdownPlugins';

export default function() {

	CodeMirror.registerHelper('hint', 'plugins', function(editor) { // (editor,options)

		let result = null;
		try {
			const cur = editor.getCursor();
			const token = editor.getTokenAt(cur);
			const isPageEditor = editor.getOption('isPage');

			if (token && token.type && token.type.indexOf('pubpub-markdown') !== -1) {

				const line = editor.getLine(cur.line);
				let startPos = token.start;
				let char = line.charAt(startPos);
				let completionString = '' + char;
				while (char !== '[' && startPos > 0) {
					startPos--;
					char = line.charAt(startPos);
					completionString = char + completionString;
				}

				const list = [];

				for (const plugin in Plugins) {
					if (Plugins.hasOwnProperty(plugin) && Plugins[plugin].Config.autocomplete === true && (!Plugins[plugin].Config.page || isPageEditor)) {
						const pluginString = JSON.stringify({pluginType: plugin});
						if (completionString.length >= 2 && plugin.charAt(0) === completionString.charAt(1)) {
							list.unshift({text: pluginString + ']]', displayText: plugin});
						} else {
							list.push({text: pluginString + ']]', displayText: plugin});
						}
					}
				}

				if (token.end - startPos <= 8 && completionString.indexOf(':') === -1) {
					result = {list: list, from: CodeMirror.Pos(cur.line, startPos + 1), to: CodeMirror.Pos(cur.line, token.end)};
				}
			}

		} catch (err) {
			console.warn(err);
		}
		return result;
	});


	const start = [
		{regex: /\[\[[a-zA-Z]*\]\]/, token: 'ppm ppm-autofill'}
	];

	for (const pluginKey in Plugins) {
		if (Plugins.hasOwnProperty(pluginKey)) {
			const plugin = Plugins[pluginKey];
			// console.log(plugin);
			start.push({
				regex: new RegExp('\\[\\[\{"pluginType":"' + plugin.Config.title + '".*?\\]\\]'),
				token: 'ppm plugin plugin-' + plugin.Config.title
			});
		}
	}

	CodeMirror.defineSimpleMode('plugin', {
		start: start
	});

	CodeMirror.defineSimpleMode('math', {
		start: [
			{regex: /.*/, token: 'ppm ppm-math'}
		]
	});

	CodeMirror.defineSimpleMode('header', {
		start: [
			{regex: /title: .*/, token: 'pubheadertitle'}
		]
	});


	CodeMirror.defineMode('pubpubmarkdown', function(config) {
		return CodeMirror.multiplexingMode(
			CodeMirror.getMode(config, 'markdown'),
			{
				open: '[[', close: ']]',
				mode: CodeMirror.getMode(config, 'plugin'),
				innerStyle: 'pubpub-markdown',
				parseDelimiters: true
			},
			// {
			// 	open: '$', close: '$',
			// 	mode: CodeMirror.getMode(config, 'math'),
			// 	innerStyle: 'ppm-math',
			// 	parseDelimiters: false
			// }
			{
				open: 'title:', close: '\n',
				mode: CodeMirror.getMode(config, 'header'),
				parseDelimiters: true
			}


		);
	});
}
