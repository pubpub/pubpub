import { MarkSpec, Node, NodeSpec, ParseRule } from 'prosemirror-model';

export const marks: Record<string, MarkSpec> = {
	suggestion_addition: {
		attrs: {
			kind: {},
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node: string | HTMLElement) => {
					if (
						node instanceof HTMLElement &&
						node.hasAttribute('data-suggestion-addition')
					) {
						return {};
					}
					return false;
				},
			},
		],
		toDOM: () => {
			return ['span', { 'data-suggestion-addition': true }];
		},
	},
	suggestion_removal: {
		attrs: {
			kind: {},
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node: string | HTMLElement) => {
					if (
						node instanceof HTMLElement &&
						node.hasAttribute('data-suggestion-removal')
					) {
						return {};
					}
					return false;
				},
			},
		],
		toDOM: () => {
			return ['span', { 'data-suggestion-removal': true }];
		},
	},
};

export const amendNodeSpecWithSuggestedEdits = (nodeSpec: NodeSpec) => {
	const { inline, parseDOM, toDOM, attrs } = nodeSpec;
	if (!inline) {
		return {
			...nodeSpec,
			attrs: {
				...attrs,
				suggestion: {
					default: null,
				},
			},
			parseDOM: parseDOM?.map((rule: ParseRule) => {
				const { getAttrs } = rule;
				return {
					...rule,
					getAttrs: (element: HTMLElement) => {
						const originalAttrs = getAttrs?.(element);
						if (originalAttrs) {
							return {
								...originalAttrs,
								suggestion: element.getAttribute('data-suggestion'),
							};
						}
						return originalAttrs;
					},
				};
			}),
			toDOM: (node: Node) => {
				const { suggestion } = node.attrs;
				const domOutputSpec = toDOM?.(node);
				const suggestionAttr = suggestion ? { 'data-suggestion': suggestion } : {};
				if (Array.isArray(domOutputSpec)) {
					const [tagEntry, maybeAttrsEntry, ...restEntries] = domOutputSpec;
					if (maybeAttrsEntry && typeof maybeAttrsEntry === 'object') {
						return [
							tagEntry,
							{ ...maybeAttrsEntry, ...suggestionAttr },
							...restEntries,
						];
					}
					return [tagEntry, suggestionAttr, maybeAttrsEntry, ...restEntries];
				}
				return domOutputSpec;
			},
		};
	}
	return nodeSpec;
};
