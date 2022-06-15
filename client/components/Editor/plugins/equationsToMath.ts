import { Node } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

type Replacement = {
	pos: number;
	replacementNode: Node;
};

const getEquationTranslationTransactionForState = (editorState: EditorState) => {
	const transaction = editorState.tr;
	const replacements: Replacement[] = [];
	let mustReturnTransaction = false;
	const mathInlineType = editorState.schema.nodes.math_inline;
	const mathDisplayType = editorState.schema.nodes.math_display;
	editorState.doc.descendants((node, pos) => {
		const replacementNodeType =
			node.type.name === 'equation'
				? mathInlineType
				: node.type.name === 'block_equation'
				? mathDisplayType
				: null;
		if (replacementNodeType) {
			const replacementNode = replacementNodeType.create(
				null,
				editorState.schema.text(node.attrs.value),
			);
			replacements.push({ pos, replacementNode });
			mustReturnTransaction = true;
		}
	});
	if (mustReturnTransaction) {
		replacements
			.reverse()
			.forEach(({ pos, replacementNode }) =>
				transaction.replaceWith(pos, pos + 1, replacementNode),
			);
		return transaction;
	}
	return null;
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
