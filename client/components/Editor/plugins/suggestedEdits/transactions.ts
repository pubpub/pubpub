import { Schema, Node, Fragment, Slice } from 'prosemirror-model';
import {
	AddMarkStep,
	Mapping,
	RemoveMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	Step,
} from 'prosemirror-transform';
import { Selection, EditorState, TextSelection, Transaction } from 'prosemirror-state';

import { flattenOnce } from 'utils/arrays';
import { isSuggestedEditsEnabled } from './util';
import { suggestedEditsPluginKey } from './plugin';

type StepWithDoc = {
	doc: Node;
	afterDoc: Node;
	step: Step;
	inverseStep: Step;
};

type AdditionAndRemovalSlices = {
	addition: Slice;
	removal: Slice;
	from: number;
	to: number;
};

type UnifiedStepResult = {
	step: ReplaceStep;
	mapForward: boolean;
};

type SuggestedEditKind = 'add' | 'remove';

const getStepsWithIntermediateDocs = (steps: Step[], startingDoc: Node): StepWithDoc[] => {
	const stepsWithDocs: StepWithDoc[] = [];
	let currentDoc = startingDoc;
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		const afterDoc = step.apply(currentDoc).doc!;
		stepsWithDocs.push({
			doc: currentDoc,
			step,
			inverseStep: step.invert(currentDoc),
			afterDoc,
		});
		currentDoc = afterDoc;
	}
	return stepsWithDocs;
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

const getAdditionAndRemovalSlices = (stepWithDoc: StepWithDoc): null | AdditionAndRemovalSlices => {
	const { step, inverseStep, doc, afterDoc } = stepWithDoc;
	if (step instanceof ReplaceStep && inverseStep instanceof ReplaceStep) {
		return {
			addition: step.slice,
			removal: inverseStep.slice,
			from: step.from,
			to: step.to,
		};
	}
	if (step instanceof ReplaceAroundStep && inverseStep instanceof ReplaceAroundStep) {
		const removal = doc.slice(step.from, step.to);
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
		const removal = doc.slice(step.from, step.to);
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
	stepWithDoc: StepWithDoc,
): null | UnifiedStepResult => {
	const additionAndRemoval = getAdditionAndRemovalSlices(stepWithDoc);
	if (additionAndRemoval) {
		const { addition, removal, from, to } = additionAndRemoval;
		const removedContent = applySuggestedEditMarkToFragment(schema, 'remove', removal.content);
		const addedContent = applySuggestedEditMarkToFragment(schema, 'add', addition.content);
		const unifiedSlice = new Slice(
			removedContent.append(addedContent),
			removal.openStart,
			addition.openEnd,
		);
		return {
			step: new ReplaceStep(from, to, unifiedSlice),
			mapForward: addedContent.size > 0,
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
	const stepsWithDocs = getStepsWithIntermediateDocs(steps, startingDoc);
	// First we get a list of steps we need to invert the document to its starting point before
	// these steps...
	const stepsToInvert = stepsWithDocs.map((swd) => swd.inverseStep).reverse();
	// Now we replay the steps, and after each one, we track changes with marks
	const stepsWithTrackedChanges: Step[] = [];
	let someMapForward = false;
	for (let i = 0; i < stepsWithDocs.length; i++) {
		const stepWithDoc = stepsWithDocs[i];
		const unified = getUnifiedAdditionAndRemovalStep(schema, stepWithDoc);
		if (unified) {
			const { step, mapForward } = unified;
			stepsWithTrackedChanges.push(step);
			someMapForward ||= mapForward;
		}
		if (i === 1) {
			console.log('fuck!!!');
		}
	}
	const allSteps = [...stepsToInvert, ...stepsWithTrackedChanges];
	allSteps.forEach((step) => tr.step(step));
	const newSelection = mapSelectionThroughTransaction(tr, selection, someMapForward);
	tr.setSelection(newSelection);
	return tr;
};

export const appendTransactionForSuggestedEdits = (
	transactions: readonly Transaction[],
	oldState: EditorState,
	newState: EditorState,
) => {
	const isEnabled = isSuggestedEditsEnabled(newState);
	if (isEnabled) {
		// We should be accessing the history plugin by its actual PluginKey
		const validTransactions = transactions.filter((tr) => !tr.getMeta('history$'));
		const steps = flattenOnce(validTransactions.map((tr) => tr.steps));
		return getTransactionToAddSuggestionMarks(newState, steps, oldState.doc);
	}
	return null;
};
