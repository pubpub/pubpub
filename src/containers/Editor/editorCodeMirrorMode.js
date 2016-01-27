/* global CodeMirror */

import Plugins from '../../components/EditorPluginsNew/index.js';

export default function() {

	const plugins = {};

	const start = [
		{regex: /\[\[title:.*\]\]/, token: 'ppm ppm-title'},
		{regex: /\[\[abstract:.*\]\]/, token: 'ppm ppm-abstract'},
		{regex: /\[\[authorsNote:.*\]\]/, token: 'ppm ppm-authorsNote'}
	];
	for (const pluginName in Plugins) {
		if (Plugins.hasOwnProperty(pluginName)) {
			Plugins[pluginName].then(function(plugin) {
				plugins[pluginName] = plugin;
				start.push({
					regex: new RegExp('\\[\\[' + plugin.Config.title + ':.*\\]\\]'),
					token: 'ppm plugin plugin-' + plugin.Config.title
				});
			});
		}
	}

	CodeMirror.registerHelper('hint', 'plugins', function(editor) { // (editor,options)

		let result = null;
		try {
			const cur = editor.getCursor();
			const token = editor.getTokenAt(cur);

			if (token.type === 'pubpub-markdown') {

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

				for (const plugin in plugins) {
					if (plugins.hasOwnProperty(plugin) && plugins[plugin].Config.autocomplete === true) {
						if (completionString.length >= 2 && plugin.charAt(0) === completionString.charAt(1)) {
							list.unshift({text: plugin + ': ]]', displayText: plugin});
						} else {
							list.push({text: plugin + ': ]]', displayText: plugin});
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

	/*
	for (const plugin in plugins) {
		if (plugins.hasOwnProperty(plugin)) {
			start.push({
				regex: new RegExp('\\{\\{' + plugin + ':.*\\}\\}'),
				token: 'ppm plugin plugin-' + plugin
			});
		}
	}
	*/





	CodeMirror.defineSimpleMode('plugin', {
		start: start
	});

	CodeMirror.defineSimpleMode('math', {
		start: [
			{regex: /.*/, token: 'ppm ppm-math'}
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


		);
	});
}
