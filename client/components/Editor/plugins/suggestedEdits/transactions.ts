import { Schema, Node, Fragment, Slice } from 'prosemirror-model';
import { AddMarkStep, Mapping, ReplaceAroundStep, ReplaceStep, Step } from 'prosemirror-transform';
import { Selection, EditorState, TextSelection, Transaction } from 'prosemirror-state';

import { flattenOnce } from 'utils/arrays';
import { isSuggestedEditsEnabled } from './util';
import { suggestedEditsPluginKey } from './plugin';

type StepWithDoc = {
	doc: Node;
	step: Step;
	inverseStep: Step;
};

type RemovedAndAddedSlices = {
	removed: Slice;
	added: Slice;
	position: number;
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
		stepsWithDocs.push({ doc: currentDoc, step, inverseStep: step.invert(currentDoc) });
		currentDoc = step.apply(currentDoc).doc!;
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

const applySuggestedEditMark = <Target extends Node | Fragment>(
	schema: Schema,
	kind: SuggestedEditKind,
	target: Target,
): Target => {
	if (target instanceof Fragment) {
		const updatedChildren: Node[] = [];
		for (let i = 0; i < target.childCount; i++) {
			const child = target.child(i);
			const updatedChild = applySuggestedEditMark(schema, kind, child);
			updatedChildren.push(updatedChild);
		}
		return Fragment.from(updatedChildren) as Target;
	}
	if (target instanceof Node) {
		const mark = getMarkForSuggestedEditKind(schema, kind);
		if (
			nodeIsSuggestedEditTarget(schema, target) &&
			!nodeHasSuggestedEditMark(schema, kind, target)
		) {
			return target.mark([...target.marks, mark.create()]) as Target;
		}
		return target.copy(applySuggestedEditMark(schema, kind, target.content)) as Target;
	}
	return target as Target;
};

const getUnifiedAdditionAndRemovalStep = (
	schema: Schema,
	stepWithDoc: StepWithDoc,
): null | UnifiedStepResult => {
	const { step, inverseStep } = stepWithDoc;
	if (step instanceof ReplaceStep && inverseStep instanceof ReplaceStep) {
		const removedContent = applySuggestedEditMark(schema, 'remove', inverseStep.slice.content);
		const addedContent = applySuggestedEditMark(schema, 'add', step.slice.content);
		const slice = new Slice(
			removedContent.append(addedContent),
			inverseStep.slice.openStart,
			step.slice.openEnd,
		);
		return {
			step: new ReplaceStep(step.from, step.to, slice),
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
	}
	const allSteps = [...stepsToInvert, ...stepsWithTrackedChanges];
	allSteps.forEach((step) => tr.step(step));
	const newSelection = mapSelectionThroughTransaction(tr, selection, someMapForward);
	tr.setSelection(newSelection);
	return tr;
};

const transactionDeletedNoContentOutsideOfAdditionMark = (tr: Transaction) => {
	const additionMark = getMarkForSuggestedEditKind(tr.doc.type.schema, 'add');
	if (!tr.docChanged) {
		return true;
	}
	return tr.steps.every((step, index) => {
		let stepDeletedNoContentOutsideOfAdditionMark = true;
		const stepMap = step.getMap();
		stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
			const hasDeleted = newEnd === newStart;
			if (hasDeleted) {
				const docBeforeStep = index === 0 ? tr.before : tr.docs[index - 1];
				const sliceOfStep = docBeforeStep.slice(oldStart, oldEnd);
				sliceOfStep.content.descendants((node: Node) => {
					if (
						nodeIsSuggestedEditTarget(tr.doc.type.schema, node) &&
						!nodeHasSuggestedEditMark(tr.doc.type.schema, 'add', node)
					) {
						stepDeletedNoContentOutsideOfAdditionMark = false;
					}
				});
			} else {
				stepDeletedNoContentOutsideOfAdditionMark = false;
			}
		});
		return stepDeletedNoContentOutsideOfAdditionMark;
	});
};

export const appendTransactionForSuggestedEdits = (
	transactions: Transaction[],
	oldState: EditorState,
	newState: EditorState,
) => {
	const isEnabled = isSuggestedEditsEnabled(newState);
	const canSkip = transactions.every((tr) =>
		transactionDeletedNoContentOutsideOfAdditionMark(tr),
	);
	if (isEnabled && !canSkip) {
		const validTransactions = transactions.filter((tr) => !tr.getMeta('history$'));
		const steps = flattenOnce(validTransactions.map((tr) => tr.steps));
		return getTransactionToAddSuggestionMarks(newState, steps, oldState.doc);
	}
	return null;
};
