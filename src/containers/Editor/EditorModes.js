export default function() {
	CodeMirror.defineSimpleMode("plugin", {
		start: [
			{regex: /.*/, token: "string"},
		],
		comment: [
			{regex: /.*?\*\//, token: "comment", next: "start"},
			{regex: /.*/, token: "comment"}
		],
		meta: {
			dontIndentStates: ["comment"],
			lineComment: "//"
		}
	});

	CodeMirror.defineMode("pubpubmarkdown", function(config) {
		return CodeMirror.multiplexingMode(
			CodeMirror.getMode(config, "markdown"),
			{open: "::", close: "::",
			 mode: CodeMirror.getMode(config, "plugin"),
			 delimStyle: "plugindelimit"}
		);
	});
}
