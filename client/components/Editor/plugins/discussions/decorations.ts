import { Node } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { flattenOnce } from './util';
import { DiscussionsUpdateResult } from './types';

type DiscussionDecoration = Decoration<{ key: string; discussionId: string }>;

const createInlineDecoration = (
	discussionId: string,
	from: number,
	to: number,
): DiscussionDecoration => {
	return Decoration.inline(
		from,
		to,
		{ class: `discussion-range d-${discussionId}` },
		{ key: `discussion-inline-${discussionId}`, discussionId: discussionId },
	);
};

const createWidgetDecoration = (discussionId: string, position: number): DiscussionDecoration => {
	const element = document.createElement('span');
	element.className = `discussion-mount dm-${discussionId}`;
	return Decoration.widget(position, element, {
		stopEvent: () => true,
		discussionId: discussionId,
		key: `discussion-widget-${discussionId}`,
		marks: [],
	});
};

const shouldRemoveDecoration = (decoration: Decoration, updateResult: DiscussionsUpdateResult) => {
	return updateResult.removedDiscussionIds.has(decoration.spec.discussionId);
};

const getDecorationsToAdd = (updateResult: DiscussionsUpdateResult): DiscussionDecoration[] => {
	return flattenOnce(
		[...updateResult.addedDiscussionIds].map((id) => {
			const { selection } = updateResult.discussions[id];
			if (selection) {
				const { anchor, head } = selection;
				const from = Math.min(anchor, head);
				const to = Math.max(anchor, head);
				return [createInlineDecoration(id, from, to), createWidgetDecoration(id, to)];
			}
			return [];
		}),
	);
};

export const getDecorationsForUpdateResult = (
	currentDecorations: DecorationSet,
	updateResult: DiscussionsUpdateResult,
	targetDoc: Node,
) => {
	const decorationsToAdd = getDecorationsToAdd(updateResult);
	const decorationsToRemove = currentDecorations
		.find()
		.filter((decoration) => shouldRemoveDecoration(decoration, updateResult));

	return currentDecorations
		.remove(decorationsToRemove)
		.map(updateResult.mapping, targetDoc)
		.add(targetDoc, decorationsToAdd);
};
