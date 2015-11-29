/* global CodeMirror */

export function insertText(cm, formatting, baseText) {

	switch (formatting) {
	case 'H1':
		return cm.replaceSelection('# ' + baseText + '\n');
	case 'H2':
		return cm.replaceSelection('## ' + baseText + '\n');
	case 'H3':
		return cm.replaceSelection('### ' + baseText + '\n');
	case 'Bold':
		return cm.replaceSelection('**' + baseText + '**');
	case 'Italic':
		return cm.replaceSelection('*' + baseText + '*');
	case '# List':
		return cm.replaceSelection('\n 1. ' + baseText + '\n');
	case '- List':
		return cm.replaceSelection('\n -  ' + baseText + '\n');
	case 'Image':
		return cm.replaceSelection('[image]');
	case 'Video':
		return cm.replaceSelection('[video]');
	default:
		return null;
	}

}

// focusEditor: function(title, index) {
export function createFocusDoc(title, cmOptions) {
	// Get main codemirror doc
	const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;

	// Erase the existing focus CodeMirror
	document.getElementById('codemirror-focus-wrapper').innerHTML = '';

	let startLine = undefined;
	let endLine = undefined;

	// Iterate over all lines in the doc
	cm.eachLine(function(line) {
		// Proceed if either startLine or endLine is undefined
		if (typeof(startLine) === 'undefined' || typeof(endLine) === 'undefined') {

			// If we have a startline, but no endline, check to see if the line is a header
			// We wish to set endline to the first #H1 header after startline
			if (typeof(endLine) === 'undefined' && typeof(startLine) !== 'undefined' && line.stateAfter.header === 1 && line.text !== '') {
				endLine = cm.getLineNumber(line);
			}

			// If we don't yet have a startline, see if the current line matches the format of the selected title
			if (typeof(startLine) === 'undefined' && line.text.indexOf('# ' + title) > -1) {
				startLine = cm.getLineNumber(line);
			}
		}
	});

	// Create new linked doc from startline and endLine
	const newFocus = cm.linkedDoc({
		from: startLine,
		to: endLine,
		sharedHist: true,
	});

	// Create new codemirror inside of the focus-wrapper
	const cmFocus = CodeMirror(document.getElementById('codemirror-focus-wrapper'), cmOptions);

	// Insert the new focus doc
	cmFocus.swapDoc(newFocus);

	// Scroll to top.
	// We had a weird bug where the focus was defaulting to the bottom of the div
	document.getElementById('editor-text-wrapper').scrollTop = 0;
}
