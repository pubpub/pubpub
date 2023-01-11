import { Node, Mark, Attrs, MarkType } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { suggestionNodeAttributes } from './schema';

export type SuggestionKind = 'addition' | 'modification' | 'removal';

export type SuggestionNodeAttribute = keyof typeof suggestionNodeAttributes;

export type SuggestedEditsTransactionContext = {
	nodeHasSuggestion: (node: Node) => boolean;
	nodeHasSuggestionKind: (node: Node, kind: SuggestionKind) => boolean;
	createMarkForSuggestionKind: (
		suggestionKind: SuggestionKind,
		suggestionOriginalMarks?: readonly Mark[],
	) => Mark;
	addSuggestionToRange: (
		tr: Transaction,
		from: number,
		to: number,
		suggestionKind: SuggestionKind,
	) => void;
	addSuggestionToNode: (
		tr: Transaction,
		pos: number,
		currentNode: Node,
		suggestionKind: SuggestionKind,
		suggestionOriginalAttrs?: Attrs,
	) => void;
};

export type PerSchemaSuggestedEditsTransactionContext = Pick<
	SuggestedEditsTransactionContext,
	'nodeHasSuggestion' | 'nodeHasSuggestionKind'
>;

export type SuggestedEditsPluginState = {
	isEnabled: boolean;
	suggestionUserId: string;
	getMarkTypeForSuggestionKind: (kind: SuggestionKind) => MarkType;
	createMarkForSuggestionKind: (
		suggestionKind: SuggestionKind,
		attrs: Exclude<SuggestionMarkAttrs, 'suggestionOriginalMarks'>,
		suggestionOriginalMarks?: readonly Mark[],
	) => Mark;
} & PerSchemaSuggestedEditsTransactionContext;

export type SuggestionAttrs = {
	suggestionId: string;
	suggestionTimestamp: number;
	suggestionUserId: null | string;
	suggestionDiscussionId: null | string;
};

export type SuggestionMarkAttrs = SuggestionAttrs & {
	suggestionOriginalMarks?: null | string;
};

export type SuggestionNodeAttrs = SuggestionAttrs & {
	suggestionKind: SuggestionKind;
	suggestionOriginalAttrs?: null | string;
};
