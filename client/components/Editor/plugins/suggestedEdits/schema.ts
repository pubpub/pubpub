import { Mark, MarkSpec } from 'prosemirror-model';

type SuggestionKind = 'addition' | 'removal';

const createParseDomForKind = (kind: SuggestionKind) => {
	return ['div', 'span'].map((tag) => {
		return {
			tag,
			getAttrs: (node: string | HTMLElement) => {
				console.log('getAttrs', kind, node);
				if (
					node instanceof HTMLElement &&
					node.hasAttribute(`data-suggested-edits-${kind}`)
				) {
					return {};
				}
				return false;
			},
		};
	});
};

export const marks: Record<string, MarkSpec> = {
	suggested_edits_addition: {
		inclusive: false,
		parseDOM: createParseDomForKind('addition'),
		toDOM: (_: Mark, inline: boolean) => {
			return [inline ? 'span' : 'div', { 'data-suggested-edits-addition': true }];
		},
	},
	suggested_edits_removal: {
		inclusive: false,
		parseDOM: createParseDomForKind('removal'),
		toDOM: (_: Mark, inline: boolean) => {
			return [inline ? 'span' : 'div', { 'data-suggested-edits-removal': true }];
		},
	},
};
