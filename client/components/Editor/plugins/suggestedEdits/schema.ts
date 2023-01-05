import { Mark, MarkSpec, Node, NodeSpec, ParseRule } from 'prosemirror-model';

export const marks: Record<string, MarkSpec> = {
	suggestion: {
		attrs: {
			kind: {},
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node: string | HTMLElement) => {
					if (node instanceof HTMLElement && node.hasAttribute('data-suggestion-mark')) {
						return { suggestion: node.getAttribute('data-suggestion-mark') };
					}
					return false;
				},
			},
		],
		toDOM: (mark: Mark) => {
			const { kind } = mark.attrs;
			return ['span', { 'data-suggestion-mark': kind }];
		},
	},
};

export const amendNodeSpecWithSuggestedEdits = (nodeSpec: NodeSpec) => {
	const { group, parseDOM, toDOM, attrs } = nodeSpec;
	if (group === 'block') {
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
					console.log('dOS', domOutputSpec);
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
