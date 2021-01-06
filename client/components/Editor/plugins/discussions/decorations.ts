import { Node } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { flattenOnce } from './util';
import { DiscussionInfo, DiscussionsUpdateResult } from './types';

type DiscussionDecoration = Decoration<{ key: string; discussionId: string }>;

const createInlineDecoration = (
	discussionId: string,
	discussion: DiscussionInfo,
): null | DiscussionDecoration => {
	const { selection } = discussion;
	if (selection) {
		const { anchor, head } = selection;
		const from = Math.min(anchor, head);
		const to = Math.max(anchor, head);
		return Decoration.inline(
			from,
			to,
			{ class: `discussion-range d-${discussionId}` },
			{ key: `discussion-inline-${discussionId}`, discussionId: discussionId },
		);
	}
	return null;
};

const shouldRemoveDecoration = (decoration: Decoration, updateResult: DiscussionsUpdateResult) => {
	return updateResult.removedDiscussionIds.has(decoration.spec.discussionId);
};

const getDecorationsToAdd = (updateResult: DiscussionsUpdateResult): DiscussionDecoration[] => {
	const decorationsByDiscussion = [...updateResult.addedDiscussionIds].map((id) => {
		const discussion = updateResult.discussions[id];
		return [createInlineDecoration(id, discussion)];
	});
	return flattenOnce(decorationsByDiscussion).filter((x): x is DiscussionDecoration => !!x);
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
