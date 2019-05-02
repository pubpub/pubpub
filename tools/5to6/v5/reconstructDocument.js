/* eslint-disable no-restricted-syntax, no-loop-func */
const { error } = require('../problems');
const editorSchema = require('../util/editorSchema');

/**
 * A container representing an intermediate state in reconstructing a doc from its changes
 * @param {Document} doc -- a document created by applying changes 1...index
 * @param {Change} change -- the change that was most recently applied to produce this document
 * @param {string} index -- the index of this intermediate state in the timeline
 * @param {Map<Step, Document>} docsWithinChange -- docs that were created from intermediate steps
 */
function IntermediateDocState(doc, change, index, docsWithinChange) {
	this.doc = doc;
	this.change = change;
	this.index = index;
	this.docsWithinChange = docsWithinChange;
}

const newDoc = () =>
	editorSchema.nodeFromJSON({
		type: 'doc',
		attrs: { meta: {} },
		content: [{ type: 'paragraph' }],
	});

const reconstructDocument = function*(changes, startingState) {
	let state = startingState || { index: -1, doc: newDoc() };
	for (const change of changes) {
		let docWithinChange = state.doc;
		const docsWithinChange = new Map();
		for (const step of change.steps || []) {
			try {
				const { doc: nextDoc, failed } = step.apply(docWithinChange);
				if (failed) {
					throw new Error(failed);
				} else {
					docsWithinChange.set(step, nextDoc);
					docWithinChange = nextDoc;
				}
			} catch (err) {
				throw error(err.toString(), { changeIndex: state.index + 1, step: step });
			}
		}
		state = new IntermediateDocState(
			docWithinChange,
			change,
			state.index + 1,
			docsWithinChange,
		);
		yield state;
	}
};

module.exports = {
	reconstructDocument: reconstructDocument,
	IntermediateDocState: IntermediateDocState,
};
