/* global CodeMirror */

export function insertText(cm, formatting, showPopup) {

	const currentSelection = cm.getSelection();
	const baseText = currentSelection !== '' ? currentSelection : 'example';

	switch (formatting) {
	case 'H1':
		cm.replaceSelection('# ' + baseText + '\n');
		break;
	case 'H2':
		cm.replaceSelection('## ' + baseText + '\n');
		break;
	case 'H3':
		cm.replaceSelection('### ' + baseText + '\n');
		break;
	case 'Bold':
		cm.replaceSelection('**' + baseText + '**');
		break;
	case 'Italic':
		cm.replaceSelection('*' + baseText + '*');
		break;
	case '# List':
		cm.replaceSelection('\n 1. ' + baseText + '\n');
		break;
	case '- List':
		cm.replaceSelection('\n -  ' + baseText + '\n');
		break;
	case 'Line':
		cm.replaceSelection('\n***\n');
		break;
	case 'Link':
		cm.replaceSelection('[Link Title](http:// Link URL)');
		break;
	case 'Image':
		cm.replaceSelection('[[image: ]]');
		showPopup();
		break;
	case 'Video':
		cm.replaceSelection('[[video: ]]');
		showPopup();
		break;
	case 'Cite':
		cm.replaceSelection('[[cite: ]]');
		showPopup();
		break;
	case 'Pagebreak':
		cm.replaceSelection('[[pagebreak]]');
		break;
	case 'Linebreak':
		cm.replaceSelection('[[linebreak]]');
		break;
	case 'Quote':
		cm.replaceSelection('[[quote: ]]');
		break;
	default:
		throw new Error('Insert command not found');
	}

	return;

}

export function addCodeMirrorKeys(cm) {
	const map = {
		'Cmd-S': ()=>{},
		'Cmd-B': ()=>{insertText(cm, 'Bold');},
		'Cmd-I': ()=>{insertText(cm, 'Italic');},
	};
	cm.addKeyMap(map);
	return;
}

// focusEditor: function(title, index) {
export function createFocusDoc(title, cmOptions) {
	// Get main codemirror doc
	const cm = document.getElementById('codemirror-wrapper').childNodes[0].childNodes[0].CodeMirror;

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

			// if (typeof(endLine) === 'undefined' && typeof(startLine) !== 'undefined' && line.stateAfter.outer.header === 1 && line.text !== '') {
			if (typeof(endLine) === 'undefined' && typeof(startLine) !== 'undefined' && line.text.substring(0, 2) === '# ') {
				endLine = cm.getLineNumber(line);
			}
			// If we don't yet have a startline, see if the current line matches the format of the selected title
			if (typeof(startLine) === 'undefined' && line.text.replace(/[^A-Za-z0-9 #]/g, '').indexOf('# ' + title.replace(/[^A-Za-z0-9 #]/g, '')) > -1) {
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
