import { Schema, Node, Fragment, Slice, MarkType } from 'prosemirror-model';
import {
	AddMarkStep,
	Mappable,
	Mapping,
	RemoveMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	Step,
	Transform,
} from 'prosemirror-transform';
import { ChangeSet } from 'prosemirror-changeset';
import { Selection, EditorState, TextSelection, Transaction } from 'prosemirror-state';

import { flattenOnce } from 'utils/arrays';
import { isSuggestedEditsEnabled } from './util';
import { suggestedEditsPluginKey } from './plugin';

const mapSelectionThroughTransaction = (
	transaction: Transaction,
	startingSelection: Selection,
	mapForward: boolean,
) => {
	if (startingSelection instanceof TextSelection) {
		const assoc = mapForward ? 1 : -1;
		return transaction.steps.reduce((selection: TextSelection, step: Step, index: number) => {
			const map = step.getMap();
			const nextAnchor = map.map(selection.anchor, assoc);
			const nextHead = map.map(selection.head, assoc);
			const currentDoc =
				index === transaction.docs.length ? transaction.docs[index + 1] : transaction.doc;
			return TextSelection.create(currentDoc, nextAnchor, nextHead);
		}, startingSelection);
	}
	return startingSelection.map(transaction.doc, transaction.mapping);
};

const canNodeTypeHaveSimultaneousAdditionAndDeletion = (node: Node) => {
	const { type } = node;
	const { schema } = type;
	// return type === schema.nodes.table_header || type === schema.nodes.table_cell;
	return false;
};

const shouldNodeBeIncludedInRemovalFragment = (node: Node) => {
	const {
		attrs,
		marks,
		type: { schema },
	} = node;
	if (canNodeTypeHaveSimultaneousAdditionAndDeletion(node)) {
		return true;
	}
	if (attrs.suggestion === 'addition') {
		return false;
	}
	if (marks.some((mark) => mark.type === schema.marks.suggestion_addition)) {
		return false;
	}
	return true;
};

const getNetRemovalFragment = (fragment: Fragment) => {
	const children: Node[] = [];
	for (let i = 0; i < fragment.childCount; i++) {
		const child = fragment.child(i);
		if (shouldNodeBeIncludedInRemovalFragment(child)) {
			const newChildFramgent = getNetRemovalFragment(child.content);
			const newChild = child.copy(newChildFramgent);
			children.push(newChild);
		}
	}
	return Fragment.from(children);
};

const getNetRemovalSlice = (slice: Slice) => {
	const { content, openStart, openEnd } = slice;
	const netContent = getNetRemovalFragment(content);
	return new Slice(netContent, openStart, openEnd);
};

const getTransactionToAddSuggestionMarks = (
	state: EditorState,
	transactions: readonly Transaction[],
) => {
	const { tr, schema } = state;
	const additionMark = schema.marks.suggestion_addition.create();
	const removalMark = schema.marks.suggestion_removal.create();

	const changeset = transactions.reduce(
		(set, txn) =>
			set.addSteps(
				txn.doc,
				txn.steps.map((step) => step.getMap()),
				null,
			),
		ChangeSet.create(transactions[0].before),
	);

	[...changeset.changes]
		.sort((x, y) => y.fromB - x.fromB)
		.forEach((change) => {
			const { fromA, toA, fromB, toB } = change;
			tr.addMark(fromB, toB, additionMark);
			tr.doc.nodesBetween(fromB, toB, (node: Node, pos: number) => {
				if (pos >= fromB && pos <= toB && !node.isText) {
					console.log('setting suggestion mark on node', node.toJSON());
					tr.setNodeAttribute(pos, 'suggestion', 'addition');
				}
			});

			const removedSlice = getNetRemovalSlice(changeset.startDoc.slice(fromA, toA));
			if (removedSlice.size > 0) {
				console.log('restoring removedSlice', removedSlice.content.toJSON());
				const newToB = fromB + removedSlice.size;
				tr.replace(fromB, fromB, removedSlice);
				tr.addMark(fromB, newToB, removalMark);
				tr.doc.nodesBetween(fromB, newToB, (node: Node, pos: number) => {
					if (pos >= fromB && pos <= newToB && !node.isText) {
						tr.setNodeAttribute(pos, 'suggestion', 'removal');
					}
				});
			}
		});

	const newSelection = mapSelectionThroughTransaction(tr, state.selection, false);
	tr.setSelection(newSelection);
	return tr;
};

export const appendTransactionForSuggestedEdits = (
	transactions: readonly Transaction[],
	oldState: EditorState,
	newState: EditorState,
) => {
	const isEnabled = isSuggestedEditsEnabled(newState);
	// We should be accessing the history plugin by its actual PluginKey
	const validTransactions = transactions.filter(
		(tr) =>
			!tr.getMeta('history$') &&
			!tr.getMeta(suggestedEditsPluginKey) &&
			!tr.getMeta('appendedTransaction'),
	);
	if (isEnabled && validTransactions.length && transactions.some((tr) => tr.docChanged)) {
		const steps = flattenOnce(validTransactions.map((tr) => tr.steps));
		const tr = getTransactionToAddSuggestionMarks(newState, transactions);
		// tr.setMeta(suggestedEditsPluginKey, { isFromPlugin: true });
		return tr;
	}
	return null;
};
