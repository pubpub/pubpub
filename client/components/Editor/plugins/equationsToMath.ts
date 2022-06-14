import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

const getEquationTranslationTransactionForState = (editorState: EditorState) => {
	const transaction = editorState.tr;
	let mustReturnTransaction = false;
	const mathInlineType = editorState.schema.nodes.math_inline;
	const mathDisplayType = editorState.schema.nodes.math_display;
	editorState.doc.descendants((node, pos) => {
		if (node.type.name === 'equation') {
			const replacementInlineMath = mathInlineType.create(
				null,
				editorState.schema.text(node.attrs.value),
			);
			transaction.replaceWith(pos, pos + 1, replacementInlineMath);
			mustReturnTransaction = true;
		}
		if (node.type.name === 'block_equation') {
			const replacementDisplayMath = mathDisplayType.create(
				null,
				editorState.schema.text(node.attrs.value),
			);
			transaction.replaceWith(pos, pos + 1, replacementDisplayMath);
			mustReturnTransaction = true;
		}
	});
	return mustReturnTransaction ? transaction : null;
};

export default (_, props) => {
	if (props.isReadOnly) {
		return [];
	}
	return new Plugin({
		view: (editorView: EditorView) => {
			const transaction = getEquationTranslationTransactionForState(editorView.state);
			if (transaction) {
				editorView.dispatch(transaction);
			}
			return {};
		},
		appendTransaction: (transactions, __, newState) =>
			getEquationTranslationTransactionForState(newState),
	});
};
