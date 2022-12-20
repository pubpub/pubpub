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
import { Selection, EditorState, TextSelection, Transaction } from 'prosemirror-state';

import { flattenOnce } from 'utils/arrays';
import { isSuggestedEditsEnabled } from './util';
import { suggestedEditsPluginKey } from './plugin';

type AdditionAndRemovalSlices = {
	addition: Slice;
	removal: Slice;
	from: number;
	to: number;
};

type UnifiedStepResult = {
	unifiedStep: ReplaceStep;
	mapSelectionForward: boolean;
};

type StepTransition = {
	beforeDoc: Node;
	afterDoc: Node;
	step: Step;
	inverseStep: Step;
};

type SuggestedEditKind = 'add' | 'remove';

const getStepsToInvert = (steps: Step[], startingDoc: Node): Step[] => {
	const inverseSteps: Step[] = [];
	let currentDoc = startingDoc;
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		const inverseStep = step.invert(currentDoc);
		inverseSteps.push(inverseStep);
		currentDoc = step.apply(currentDoc).doc!;
	}
	return inverseSteps.reverse();
};

const getMarkForSuggestedEditKind = (schema: Schema, kind: SuggestedEditKind) => {
	return kind === 'add'
		? schema.marks.suggested_edits_addition
		: schema.marks.suggested_edits_removal;
};

const nodeHasSuggestedEditMark = (schema: Schema, kind: SuggestedEditKind, node: Node) => {
	const kindMark = getMarkForSuggestedEditKind(schema, kind);
	return node.marks.some((mark) => mark.type === kindMark);
};

const nodeIsSuggestedEditTarget = (schema: Schema, node: Node) => {
	return node.type === schema.nodes.text;
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

const applySuggestedEditMarkToFragment = (
	schema: Schema,
	kind: SuggestedEditKind,
	fragment: Fragment,
): Fragment => {
	const updatedChildren: Node[] = [];
	for (let i = 0; i < fragment.childCount; i++) {
		const child = fragment.child(i);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const updatedChild = applySuggestedEditMarkToNode(schema, kind, child);
		if (updatedChild) {
			updatedChildren.push(updatedChild);
		}
	}
	return Fragment.from(updatedChildren);
};

const applySuggestedEditMarkToNode = (
	schema: Schema,
	kind: SuggestedEditKind,
	node: Node,
): null | Node => {
	const otherKind = kind === 'add' ? 'remove' : 'add';
	if (nodeIsSuggestedEditTarget(schema, node)) {
		if (nodeHasSuggestedEditMark(schema, otherKind, node)) {
			// Don't add an addition mark to a removal mark or vice-versa.
			return null;
		}
		if (!nodeHasSuggestedEditMark(schema, kind, node)) {
			const mark = getMarkForSuggestedEditKind(schema, kind);
			return node.mark([...node.marks, mark.create()]);
		}
		return node;
	}
	return node.copy(applySuggestedEditMarkToFragment(schema, kind, node.content));
};

const getAdditionAndRemovalSlices = (
	stepTransition: StepTransition,
): null | AdditionAndRemovalSlices => {
	const { step, inverseStep, beforeDoc, afterDoc } = stepTransition;
	if (step instanceof ReplaceStep && inverseStep instanceof ReplaceStep) {
		return {
			addition: step.slice,
			removal: inverseStep.slice,
			from: step.from,
			to: step.to,
		};
	}
	if (step instanceof ReplaceAroundStep && inverseStep instanceof ReplaceAroundStep) {
		const removal = beforeDoc.slice(step.from, step.to);
		const stepMap = step.getMap();
		const newFrom = stepMap.map(step.from, 1);
		const newTo = stepMap.map(step.to, -1);
		const addition = afterDoc.slice(newFrom, newTo);
		return {
			removal,
			addition,
			from: step.from,
			to: step.to,
		};
	}
	if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
		const removal = beforeDoc.slice(step.from, step.to);
		const addition = afterDoc.slice(step.from, step.to);
		return {
			addition,
			removal,
			from: step.from,
			to: step.to,
		};
	}
	return null;
};

const getUnifiedAdditionAndRemovalStep = (
	schema: Schema,
	transition: StepTransition,
): null | UnifiedStepResult => {
	const additionAndRemoval = getAdditionAndRemovalSlices(transition);
	if (additionAndRemoval) {
		const { addition, removal, from, to } = additionAndRemoval;
		const removedContent = applySuggestedEditMarkToFragment(schema, 'remove', removal.content);
		const addedContent = applySuggestedEditMarkToFragment(schema, 'add', addition.content);
		console.log('addition', addition);
		const unifiedSlice = new Slice(
			removedContent.append(addedContent),
			Math.max(addition.openStart, removal.openStart),
			Math.max(addition.openEnd, removal.openEnd),
		);
		console.log('unifiedSlice', unifiedSlice);
		return {
			unifiedStep: new ReplaceStep(from, to, unifiedSlice),
			mapSelectionForward: addedContent.size > 0,
		};
	}
	return null;
};

const getTransactionToAddSuggestionMarks = (
	state: EditorState,
	steps: Step[],
	startingDoc: Node,
) => {
	const { schema, tr, selection } = state;
	let shouldMapSelectionForward = false;
	// First let's invert all the steps in the transaction to bring the document back to its
	// previous state...
	getStepsToInvert(steps, startingDoc).forEach((step) => tr.step(step));
	// Now we replay the steps as suggested edits.
	const mapping = new Mapping();
	console.log('STEPS', steps, state.doc, state.doc.toJSON());
	[...steps].forEach((step) => {
		const mappedStep = step.map(mapping);
		if (mappedStep) {
			const inverseStep = mappedStep.invert(tr.doc);
			mapping.appendMap(inverseStep.getMap());
			const transform = new Transform(tr.doc);
			const { doc: afterDoc } = transform.maybeStep(mappedStep);
			if (afterDoc) {
				const unifiedResult = getUnifiedAdditionAndRemovalStep(schema, {
					step,
					inverseStep,
					afterDoc,
					beforeDoc: tr.doc,
				});
				if (unifiedResult) {
					const { unifiedStep, mapSelectionForward } = unifiedResult;
					console.log('unified step', unifiedStep);
					mapping.appendMap(unifiedStep.getMap());
					tr.step(unifiedStep);
					shouldMapSelectionForward ||= mapSelectionForward;
				} else {
					console.log('no unifiedResult');
				}
			} else {
				console.log('maybeStep failed');
			}
		} else {
			console.log('mapping failed');
		}
	});
	const newSelection = mapSelectionThroughTransaction(tr, selection, shouldMapSelectionForward);
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
	if (isEnabled && validTransactions.length) {
		const steps = flattenOnce(validTransactions.map((tr) => tr.steps));
		const tr = getTransactionToAddSuggestionMarks(newState, steps, oldState.doc);
		tr.setMeta(suggestedEditsPluginKey, { isFromPlugin: true });
		return tr;
	}
	return null;
};
