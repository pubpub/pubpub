export default function() {
	CodeMirror.defineSimpleMode("plugin", {
		start: [
			{regex: /\[abstract.*\]/, token: "meta-abstract number"},
			{regex: /\[title.*\]/, token: "meta-abstract number"},
			{regex: /\[asset.*\]/, token: "plugin plugin-asset"},
			{regex: /\[image.*\]/, token: "plugin plugin-image"}
		],
		asset: [
			{regex: /.*/, token: "plugin-asset"},
			{regex: /\]/, token: "plugin-asset",next:'start'}
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
