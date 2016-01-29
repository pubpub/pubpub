export function generateTOC(markdown) {

	// Regex looks for # at the beginning of the string, or after a new line.
	// It allows up (inclusive) 3 spaces before the first #, to match the behavior of markdown-it
	const myRegEx = /(^|\n)( {0,3})(#+ )(.*)/g;

	const TOCs = {
		full: [],
		h1: []
	};

	let match;
	while (match = myRegEx.exec(markdown)) {
		const level = match[3].trim().length;
		const output = {
			id: match[4].replace(/\s/g, '-').toLowerCase(),
			title: match[4],
			level: level
		};

		if (level === 1) { TOCs.h1.push(output); }
		TOCs.full.push(output);
	}

	return TOCs;
	
}