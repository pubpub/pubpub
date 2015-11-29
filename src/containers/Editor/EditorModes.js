export default function() {

	/*
	CodeMirror.registerHelper('hint', 'plugins', function(editor, options) {
		try{
			var cur = editor.getCursor(), token = editor.getTokenAt(cur);
			const end = cur.ch;
			let start = end;
			//console.log(token);

			if (token.type == 'plugin-content test'){
				const tokenText = token.string;
				let list = ['asset','image','title'];
				return {list: list, from: CodeMirror.Pos(cur.line, token.start), to: CodeMirror.Pos(cur.line, token.end)};
			} else{
				return null;
			}
		} catch (err){
			console.warn(err);
		}
		return null;
	});
	*/

	CodeMirror.defineSimpleMode("plugin", {
		start: [
			//{regex: /\[/, token: "plugin-start",next:'pluginStart'}
			{regex: /\[abstract.*\]/, token: "meta-abstract number"},
			{regex: /\[title.*\]/, token: "meta-abstract number"},
			{regex: /\[asset.*\]/, token: "plugin plugin-asset"},
			{regex: /\[image.*\]/, token: "plugin plugin-image"}
		],
		pluginStart: [
			{regex: /.*/, token: "plugin-content"},
			{regex: /\]/, token: "plugin-end",next:'start'}
		]
	});

	CodeMirror.defineMode("pubpubmarkdown", function(config) {
		return CodeMirror.multiplexingMode(
			CodeMirror.getMode(config, "markdown"),
			{open: "[", close: "]",
			 mode: CodeMirror.getMode(config, "plugin"),
			 innerStyle: 'test',
		 	 parseDelimiters: true}
		);
	});
}
