import { Schema, Node, Fragment, Slice } from 'prosemirror-model';
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

type SuggestionKind = 'addition' | 'removal';

type StepTransition = {
	beforeDoc: Node;
	afterDoc: Node;
	step: Step;
};

const nodeTypeCanHaveSimultaneousAdditionAndDeletion = (node: Node) => {
	const { type } = node;
	const { schema } = type;
	return type === schema.nodes.table_header || type === schema.nodes.table_cell;
};

const getStepTransitions = (transactions: readonly Transaction[]): StepTransition[] => {
	return flattenOnce(
		transactions.map((txn) => {
			const { docs, doc, steps } = txn;
			return steps.map((step, index) => {
				const beforeDoc = docs[index];
				const afterDoc = index === steps.length - 1 ? doc : docs[index + 1];
				return { step, beforeDoc, afterDoc };
			});
		}),
	);
};

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

const getNetSuggestionFragment = (fragment: Fragment, kind: SuggestionKind) => {
	const oppositeKind = kind === 'addition' ? 'removal' : 'addition';
	const children: Node[] = [];
	for (let i = 0; i < fragment.childCount; i++) {
		const child = fragment.child(i);
		const {
			marks,
			attrs,
			type: { schema },
		} = child;
		const hasOppositeKindMark = marks.some(
			(mark) => mark.type === schema.marks.suggestion && mark.attrs.kind === oppositeKind,
		);
		const hasOppositeKindAttr = attrs.suggestion === oppositeKind;
		const skipCheckForOppositeKind = nodeTypeCanHaveSimultaneousAdditionAndDeletion(child);
		if (skipCheckForOppositeKind || (!hasOppositeKindMark && !hasOppositeKindAttr)) {
			const newChild = child.copy(getNetSuggestionFragment(child.content, kind));
			children.push(newChild);
		}
	}
	return Fragment.from(children);
};

const getNetSuggestionSlice = (slice: Slice, kind: SuggestionKind) => {
	const { content, openStart, openEnd } = slice;
	const netContent = getNetSuggestionFragment(content, kind);
	return new Slice(netContent, openStart, openEnd);
};

const getTransactionToAddSuggestionMarks = (
	state: EditorState,
	transactions: readonly Transaction[],
) => {
	const { tr, schema } = state;
	const additionMark = schema.marks.suggestion.create({ kind: 'addition' });
	const removalMark = schema.marks.suggestion.create({ kind: 'removal' });

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
					tr.setNodeAttribute(pos, 'suggestion', 'addition');
				}
			});
			const removedSlice = getNetSuggestionSlice(
				changeset.startDoc.slice(fromA, toA),
				'removal',
			);
			if (removedSlice.size > 0) {
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

	// for (let i = 0; i < stepTransitions.length; i++) {
	// 	const { step, beforeDoc } = stepTransitions[i];
	// 	const mapsOfFutureSteps = stepTransitions
	// 		.slice(i + 1, stepTransitions.length)
	// 		.map((transition) => transition.step.getMap());
	// 	const remainingStepsMapping = new Mapping(mapsOfFutureSteps);
	// 	const mapping = step.getMap();
	// 	mapping.forEach((oldStart: number, oldEnd: number, newStart: number, newEnd: number) => {
	// 		const [
	// 			oldStartInCurrentDoc,
	// 			oldEndInCurrentDoc,
	// 			newStartInCurrentDoc,
	// 			newEndInCurrentDoc,
	// 		] = [oldStart, oldEnd, newStart, newEnd].map((position) =>
	// 			remainingStepsMapping.map(position),
	// 		);
	// 		tr.addMark(newStart, newEnd, additionMark);
	// 		tr.doc.nodesBetween(
	// 			newStartInCurrentDoc,
	// 			newEndInCurrentDoc,
	// 			(node: Node, pos: number) => {
	// 				if (pos >= newStart && pos <= newEnd && !node.isText) {
	// 					console.log(node.toJSON(), pos);
	// 					tr.setNodeAttribute(pos, 'suggestion', 'addition');
	// 				}
	// 			},
	// 		);
	// 		if (newStart === newEnd) {
	// 			const sliceOfBeforeDoc = beforeDoc.slice(oldStart, oldEnd);
	// 			console.log('removed slice', sliceOfBeforeDoc);
	// 			tr.replace(newStartInCurrentDoc, newEndInCurrentDoc, sliceOfBeforeDoc);
	// 		}
	// 	});
	// }

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
