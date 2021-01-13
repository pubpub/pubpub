import { Decoration, DecorationSet } from 'prosemirror-view';

import { flattenOnce, isEmptySelection } from './util';
import { DiscussionInfo, DiscussionsUpdateResult } from './types';

type DiscussionDecoration = Decoration<{ key: string; widgetForDiscussionId?: string }>;

const getRangeFromSelection = (selection: NonNullable<DiscussionInfo['selection']>) => {
	const { anchor, head } = selection;
	const from = Math.min(anchor, head);
	const to = Math.max(anchor, head);
	return { from: from, to: to };
};

const createInlineDecoration = (
	discussionId: string,
	from: number,
	to: number,
): DiscussionDecoration => {
	return Decoration.inline(
		from,
		to,
		{ class: `discussion-range d-${discussionId}`, style: 'background:rgba(50,25,50,0.2)' },
		{ key: `discussion-inline-${discussionId}` },
	);
};

const createWidgetDecoration = (discussionId: string, position: number): DiscussionDecoration => {
	const element = document.createElement('span');
	element.className = `discussion-mount dm-${discussionId}`;
	return Decoration.widget(position, element, {
		stopEvent: () => true,
		key: `discussion-widget-${discussionId}`,
		widgetForDiscussionId: discussionId,
		side: -1,
	});
};

const getNewDecorations = (updateResult: DiscussionsUpdateResult): DiscussionDecoration[] => {
	return flattenOnce(
		[...updateResult.addedDiscussionIds].map((id) => {
			const { selection } = updateResult.discussions[id];
			if (selection) {
				const { from, to } = getRangeFromSelection(selection);
				return [createInlineDecoration(id, from, to), createWidgetDecoration(id, to)];
			}
			return [];
		}),
	);
};

const getWidgetDiscussionsToRebuild = (
	removedDicussionIds: string[],
	updateResult: DiscussionsUpdateResult,
): DiscussionDecoration[] => {
	const { discussions } = updateResult;
	return removedDicussionIds
		.map((discussionId) => {
			const discussion = discussions[discussionId];
			if (discussion) {
				const { selection } = discussion;
				if (selection && !isEmptySelection(selection)) {
					const { to } = getRangeFromSelection(selection);
					return createWidgetDecoration(discussionId, to);
				}
			}
			return null;
		})
		.filter((x): x is DiscussionDecoration => !!x);
};

const shouldRemoveDecoration = (decoration: Decoration, updateResult: DiscussionsUpdateResult) => {
	return updateResult.removedDiscussionIds.has(decoration.spec.discussionId);
};

export const getDecorationsForUpdateResult = (
	currentDecorations: DecorationSet,
	updateResult: DiscussionsUpdateResult,
) => {
	const discussionIdsremovedDuringMapping: string[] = [];
	const { doc, mapping } = updateResult;

	const handleRemovedDecoration = (spec: any) => {
		const { widgetForDiscussionId } = spec as DiscussionDecoration['spec'];
		if (widgetForDiscussionId) {
			discussionIdsremovedDuringMapping.push(widgetForDiscussionId);
		}
	};

	const decorationsToRemove = currentDecorations
		.find()
		.filter((decoration) => shouldRemoveDecoration(decoration, updateResult));

	const mappedDecorations = currentDecorations
		.remove(decorationsToRemove)
		.map(mapping, doc, { onRemove: handleRemovedDecoration });

	const decorationsToAdd = [
		...getNewDecorations(updateResult),
		...getWidgetDiscussionsToRebuild(discussionIdsremovedDuringMapping, updateResult),
	];

	return mappedDecorations.add(doc, decorationsToAdd);
};
