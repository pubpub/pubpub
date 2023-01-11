import { AttributeSpec, MarkSpec, Node, NodeSpec, ParseRule } from 'prosemirror-model';

import { mapObject, pruneFalsyObjectValues } from 'utils/objects';

const createSuggestionMark = (
	kind: string,
	extraAttrs: Record<string, { dataKey: string; spec: AttributeSpec }> = {},
): MarkSpec => {
	const attrSpecs = mapObject(extraAttrs, (attr) => attr.spec);
	return {
		attrs: {
			id: { default: null },
			userId: { default: null },
			timestamp: { default: null },
			discussionId: { default: null },
			...attrSpecs,
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node: string | HTMLElement) => {
					if (
						node instanceof HTMLElement &&
						node.hasAttribute(`data-suggestion-${kind}`)
					) {
						return mapObject(extraAttrs, (attr) => node.getAttribute(attr.dataKey));
					}
					return false;
				},
			},
		],
		toDOM: (node) => {
			const attrs: Record<string, any> = {};
			Object.entries(extraAttrs).forEach(([key, { dataKey }]) => {
				attrs[dataKey] = node.attrs[key];
			});
			return ['span', { [`data-suggestion-${kind}`]: true, ...attrs }];
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
	return {
		...nodeSpec,
		attrs: {
			...attrs,
			suggestionId: {
				default: null,
			},
			suggestionTimestamp: {
				default: null,
			},
			suggestionUserId: {
				default: null,
			},
			suggestionAction: {
				default: null,
			},
			suggestionOriginalAttrs: {
				default: null,
			},
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
							suggestionAction: element.getAttribute('data-suggestion-action'),
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
				suggestionAction,
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
				'data-suggestion-action': suggestionAction,
				'data-suggestion-original-attrs': suggestionOriginalAttrs,
			});
			if (Array.isArray(domOutputSpec)) {
				const [tagEntry, maybeAttrsEntry, ...restEntries] = domOutputSpec;
				if (maybeAttrsEntry && typeof maybeAttrsEntry === 'object') {
					return [tagEntry, { ...maybeAttrsEntry, ...suggestionAttrs }, ...restEntries];
				}
				return [tagEntry, suggestionAttrs, maybeAttrsEntry, ...restEntries];
			}
			return domOutputSpec;
		},
	};
};
