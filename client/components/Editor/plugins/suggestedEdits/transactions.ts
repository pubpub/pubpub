import { Schema, Node, Fragment, Slice } from 'prosemirror-model';
import { AddMarkStep, Mapping, ReplaceAroundStep, ReplaceStep, Step } from 'prosemirror-transform';
import { EditorState, Transaction } from 'prosemirror-state';

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
): null | Step => {
	const { step, inverseStep } = stepWithDoc;
	if (step instanceof ReplaceStep && inverseStep instanceof ReplaceStep) {
		const removedContent = applySuggestedEditMark(schema, 'remove', inverseStep.slice.content);
		const addedContent = applySuggestedEditMark(schema, 'add', step.slice.content);
		console.log(removedContent, addedContent);
		const slice = new Slice(
			removedContent.append(addedContent),
			inverseStep.slice.openStart,
			step.slice.openEnd,
		);
		return new ReplaceStep(step.from, step.to, slice);
	}
	console.log('not ReplaceStep');
	return null;
};

const getStepsToAddSuggestionMarks = (schema: Schema, steps: Step[], startingDoc: Node) => {
	const stepsWithDocs = getStepsWithIntermediateDocs(steps, startingDoc);
	// First we get a list of steps we need to invert the document to its starting point before
	// these steps...
	const stepsToInvert = stepsWithDocs.map((swd) => swd.inverseStep).reverse();
	// Now we replay the steps, and after each one, we track changes with marks
	const stepsWithTrackedChanges: Step[] = [];
	const mapping = new Mapping();
	for (let i = 0; i < stepsWithDocs.length; i++) {
		const stepWithDoc = stepsWithDocs[i];
		const unifiedStep = getUnifiedAdditionAndRemovalStep(schema, stepWithDoc);
		stepsWithTrackedChanges.push(unifiedStep);
	}
	return [...stepsToInvert, ...stepsWithTrackedChanges];
};

export const appendTransactionForSuggestedEdits = (
	transactions: readonly Transaction[],
	oldState: EditorState,
	newState: EditorState,
) => {
	const isEnabled = isSuggestedEditsEnabled(newState);
	if (isEnabled) {
		const steps = flattenOnce(
			transactions.filter((tr) => !tr.getMeta(suggestedEditsPluginKey)).map((tr) => tr.steps),
		);
		const stepsToInvert = getStepsToAddSuggestionMarks(newState.schema, steps, oldState.doc);
		const { tr } = newState;
		stepsToInvert.forEach((step) => tr.step(step));
		if (tr.steps.length) {
			tr.setMeta(suggestedEditsPluginKey, { isViaPlugin: true });
			return tr;
		}
	}
	return null;
};
