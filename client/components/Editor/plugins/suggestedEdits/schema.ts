import { Mark, MarkSpec } from 'prosemirror-model';

export const marks: Record<string, MarkSpec> = {
	suggested_edits_addition: {
		inclusive: false,
		toDOM: (_: Mark, inline: boolean) => {
			return [inline ? 'span' : 'div', { 'data-suggested-edits-addition': true }];
		},
	},
	suggested_edits_removal: {
		inclusive: false,
		toDOM: (_: Mark, inline: boolean) => {
			return [inline ? 'span' : 'div', { 'data-suggested-edits-removal': true }];
		},
	},
};
