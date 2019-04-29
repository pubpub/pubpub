/* eslint-disable no-restricted-syntax, no-loop-func */
const { error } = require('../problems');
const editorSchema = require('../util/editorSchema');

/**
 * A container representing an intermediate state in reconstructing a doc from its changes
 * @param {Document} doc -- a document created by applying changes 1...index
 * @param {Change} change -- the change that was most recently applied to produce this document
 * @param {string} index -- the index of this intermediate state in the timeline
 * @param {Array<Document>} docsWithinChange -- docs that were created from intermediate *steps*
 *   within this change. Ordinarily, we don't expect these to correspond to a user-facing version,
 *   but we'll record them for debugging purposes.
 */
function IntermediateDocState(doc, change, index, docsWithinChange) {
	this.doc = doc;
	this.change = change;
	this.index = index;
	this.docsWithinChange = docsWithinChange;
}

module.exports = function*(changes, startingState) {
	const newDoc = editorSchema.nodeFromJSON({
		type: 'doc',
		attrs: { meta: {} },
		content: [{ type: 'paragraph' }],
	});
	let state = startingState || new IntermediateDocState(newDoc, null, -1, [newDoc]);
	for (const [changeIndex, change] of changes.entries()) {
		const docsWithinChange = (change.steps || []).reduce(
			(docs, step) => {
				const lastDocWithinChange = docs[docs.length - 1];
				try {
					const { doc: nextDoc, failed } = step.apply(lastDocWithinChange);
					if (failed) {
						throw new Error(failed);
					}
					return [...docs, nextDoc];
				} catch (err) {
					throw error(err.toString(), { changeIndex: changeIndex, step: step });
				}
			},
			[state.doc],
		);
		const docAfterChange = docsWithinChange[docsWithinChange.length - 1];
		state = new IntermediateDocState(docAfterChange, change, changeIndex, docsWithinChange);
		yield state;
	}
};
