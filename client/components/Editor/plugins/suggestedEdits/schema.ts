import { Mark, MarkSpec } from 'prosemirror-model';

export const marks: Record<string, MarkSpec> = {
	suggested_edits_addition: {
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node: string | HTMLElement) => {
					if (
						node instanceof HTMLElement &&
						node.hasAttribute('data-suggested-edits-addition')
					) {
						return {};
					}
					return false;
				},
			},
		],
		toDOM: (_: Mark, inline: boolean) => {
			return [inline ? 'span' : 'div', { 'data-suggested-edits-addition': true }];
		},
	},
	suggested_edits_removal: {
		inclusive: false,
		parseDOM: [
			{
				tag: 'span',
				getAttrs: (node: string | HTMLElement) => {
					if (
						node instanceof HTMLElement &&
						node.hasAttribute('data-suggested-edits-removal')
					) {
						return {};
					}
					return false;
				},
			},
		],
		toDOM: (_: Mark, inline: boolean) => {
			return [inline ? 'span' : 'div', { 'data-suggested-edits-removal': true }];
		},
	},
};
