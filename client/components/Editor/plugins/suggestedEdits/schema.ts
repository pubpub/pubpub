import { AttributeSpec, MarkSpec, Node, NodeSpec, ParseRule } from 'prosemirror-model';

import { arraysHaveSameElements } from 'utils/arrays';
import { assert } from 'utils/assert';
import { mapObject, pruneFalsyObjectValues } from 'utils/objects';

export const suggestionNodeAttributes = [
	'suggestionId',
	'suggestionTimestamp',
	'suggestionUserId',
	'suggestionKind',
	'suggestionOriginalAttrs',
	'suggestionDiscussionId',
];

const createSuggestionMark = (
	kind: string,
	extraAttrs: Record<string, { dataKey: string; spec: AttributeSpec }> = {},
): MarkSpec => {
	const attrSpecs = mapObject(extraAttrs, (attr) => attr.spec);
	return {
		attrs: {
			id: { default: null },
			suggestionUserId: { default: null },
			suggestionTimestamp: { default: null },
			suggestionDiscussionId: { default: null },
			...attrSpecs,
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (element: string | HTMLElement) => {
					if (
						element instanceof HTMLElement &&
						element.hasAttribute(`data-suggestion-${kind}`)
					) {
						return {
							...mapObject(extraAttrs, (attr) => element.getAttribute(attr.dataKey)),
							suggestionId: element.getAttribute('data-suggestion-id'),
							suggestionUserId: element.getAttribute('data-suggestion-user-id'),
							suggestionTimestamp: element.getAttribute('data-suggestion-timestamp'),
							suggestionDiscussionId: element.getAttribute(
								'data-suggestion-discussion-id',
							),
						};
					}
					return false;
				},
			},
		],
		toDOM: (node) => {
			const moreAttrs: Record<string, any> = {};
			Object.entries(extraAttrs).forEach(([key, { dataKey }]) => {
				moreAttrs[dataKey] = node.attrs[key];
			});
			return [
				'span',
				{
					[`data-suggestion-${kind}`]: true,
					'data-suggestion-id': node.attrs.suggestionId,
					'data-suggestion-user-id': node.attrs.suggestionUserId,
					'data-suggestion-timestamp': node.attrs.suggestionTimestamp,
					'data-suggestion-discussion-id': node.attrs.suggestionDiscussionId,
					...moreAttrs,
				},
			];
		},
	};
};

export const marks: Record<string, MarkSpec> = {
	suggestion_addition: createSuggestionMark('addition'),
	suggestion_removal: createSuggestionMark('removal'),
	suggestion_modification: createSuggestionMark('modification', {
		originalMarks: {
			dataKey: 'data-original-marks',
			spec: { default: null },
		},
	}),
};

export const amendNodeSpecWithSuggestedEdits = (nodeKey: string, nodeSpec: NodeSpec): NodeSpec => {
	const { parseDOM, toDOM, attrs } = nodeSpec;
	if (nodeKey === 'text') {
		return nodeSpec;
	}
	const newAttrs = {
		suggestionId: {
			default: null,
		},
		suggestionTimestamp: {
			default: null,
		},
		suggestionUserId: {
			default: null,
		},
		suggestionDiscussionId: {
			default: null,
		},
		suggestionKind: {
			default: null,
		},
		suggestionOriginalAttrs: {
			default: null,
		},
	};
	assert(arraysHaveSameElements(Object.keys(newAttrs), suggestionNodeAttributes));
	return {
		...nodeSpec,
		attrs: {
			...attrs,
			...newAttrs,
		},
		parseDOM: parseDOM?.map((rule: ParseRule) => {
			const { getAttrs } = rule;
			return {
				...rule,
				getAttrs: (element: string | HTMLElement) => {
					const originalAttrs = getAttrs?.(element) ?? null;
					if (originalAttrs) {
						if (typeof element === 'string') {
							return originalAttrs;
						}
						return {
							...originalAttrs,
							suggestionKind: element.getAttribute('data-suggestion-kind'),
							suggestionId: element.getAttribute('data-suggestion-id'),
							suggestionUserId: element.getAttribute('data-suggestion-user-id'),
							suggestionTimestamp: element.getAttribute('data-suggestion-timestamp'),
							suggestionDiscussionId: element.getAttribute(
								'data-suggestion-discussion-id',
							),
							suggestionOriginalAttrs: element.getAttribute(
								'data-suggestion-original-attrs',
							),
						};
					}
					return originalAttrs;
				},
			};
		}),
		toDOM: (node: Node, ...restArgs: any[]) => {
			const {
				suggestionId,
				suggestionTimestamp,
				suggestionUserId,
				suggestionDiscussionId,
				suggestionKind,
				suggestionOriginalAttrs,
			} = node.attrs;
			// TS doesn't know that we let toDOM take a secondary argument
			// so we have to cast it to any
			const domOutputSpec = (toDOM as any)(node, ...restArgs);
			const suggestionAttrs = pruneFalsyObjectValues({
				'data-suggestion-id': suggestionId,
				'data-suggestion-timestamp': suggestionTimestamp,
				'data-suggestion-user-id': suggestionUserId,
				'data-suggestion-discussion-id': suggestionDiscussionId,
				'data-suggestion-kind': suggestionKind,
				'data-suggestion-original-attrs': suggestionOriginalAttrs,
			});
			if (Array.isArray(domOutputSpec)) {
				const [tagEntry, maybeAttrsEntry, ...restEntries] = domOutputSpec;
				if (
					maybeAttrsEntry &&
					typeof maybeAttrsEntry === 'object' &&
					!Array.isArray(maybeAttrsEntry)
				) {
					return [tagEntry, { ...maybeAttrsEntry, ...suggestionAttrs }, ...restEntries];
				}
				return [tagEntry, suggestionAttrs, maybeAttrsEntry, ...restEntries].filter(
					// 0 is a hole for child content so we need to preserve it
					(entry) => entry === 0 || !!entry,
				);
			}
			return domOutputSpec;
		},
	};
};
