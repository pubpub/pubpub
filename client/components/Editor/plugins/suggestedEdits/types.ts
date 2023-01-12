import { MarkType } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { suggestionNodeAttributes } from './schema';

export type SuggestionKind = 'addition' | 'modification' | 'removal';

export type SuggestionNodeAttribute = keyof typeof suggestionNodeAttributes;

export type SuggestionUniqueAttrs = {
	suggestionId: string;
};

export type SuggestionAttrsPerTransaction = {
	suggestionUserId: string;
	suggestionTimestamp: number;
};

export type SuggestionBaseAttrs = SuggestionUniqueAttrs &
	SuggestionAttrsPerTransaction & {
		suggestionDiscussionId: null | string;
		suggestionKind: SuggestionKind;
	};

export type SuggestionMarkAttrs = SuggestionBaseAttrs & {
	suggestionOriginalMarks?: null | string;
};

export type SuggestionNodeAttrs = SuggestionBaseAttrs & {
	suggestionOriginalAttrs?: null | string;
};

export type SuggestedEditsPluginState = {
	isEnabled: boolean;
	suggestionUserId: string;
	suggestionMark: MarkType;
};

export type SuggestedEditsTransactionContext = {
	existingTransactions: readonly Transaction[];
	newTransaction: Transaction;
	transactionAttrs: SuggestionAttrsPerTransaction;
	suggestionMark: MarkType;
};
