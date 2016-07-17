function pagebreak(state, startLine, endLine, silent) {

	let pos = state.bMarks[startLine] + state.tShift[startLine];

	if (state.src.charAt(pos++) !== '{') { return false; }
	if (state.src.charAt(pos++) !== '{') { return false; }
	if (state.src.charAt(pos++) !== 'p') { return false; }
	if (state.src.charAt(pos++) !== 'a') { return false; }
	if (state.src.charAt(pos++) !== 'g') { return false; }
	if (state.src.charAt(pos++) !== 'e') { return false; }
	if (state.src.charAt(pos++) !== 'b') { return false; }
	if (state.src.charAt(pos++) !== 'r') { return false; }
	if (state.src.charAt(pos++) !== 'e') { return false; }
	if (state.src.charAt(pos++) !== 'a') { return false; }
	if (state.src.charAt(pos++) !== 'k') { return false; }
	if (state.src.charAt(pos++) !== '}') { return false; }
	if (state.src.charAt(pos++) !== '}') { return false; }

	state.push('pagebreak', 'pagebreak', 0);
	state.line = startLine + 1;
	return true;
}

module.exports = function pagebreakPlugin(md) {
	md.block.ruler.before('fence', 'pagebreak', pagebreak);
};
