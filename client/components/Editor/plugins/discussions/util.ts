import { Node } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { Mapping, Step } from 'prosemirror-transform';

import { Discussions, DiscussionInfo } from './types';

const isEmptySelection = (selection: DiscussionInfo['selection']) => {
	if (selection) {
		return selection.anchor === selection.head;
	}
	return true;
};

export const mapDiscussionThroughSteps = (
	discussion: DiscussionInfo,
	fromDoc: Node,
	toDoc: Node,
	steps: Step[],
): DiscussionInfo => {
	const { selection: selectionJson } = discussion;
	if (isEmptySelection(selectionJson) || steps.length === 0) {
		return discussion;
	}
	const selection = Selection.fromJSON(fromDoc, selectionJson!);
	const mapping = new Mapping(steps.map((step) => step.getMap()));
	const nextSelection = selection.map(toDoc, mapping);
	return {
		...discussion,
		selection: nextSelection.toJSON() as any,
	};
};

export const removeDiscussionsById = (discussions: Discussions, keys: Set<string>) => {
	if (keys.size === 0) {
		return discussions;
	}
	const nextDiscussions: Discussions = {};
	Object.entries(discussions).forEach(([id, discussion]) => {
		if (!keys.has(id)) {
			nextDiscussions[id] = discussion;
		}
	});
	return nextDiscussions;
};

export const flattenOnce = <T>(arr: T[][]): T[] => arr.reduce((a, b) => [...a, ...b], []);
