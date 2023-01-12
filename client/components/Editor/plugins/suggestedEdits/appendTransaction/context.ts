import { Attrs, Mark, Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { withValue } from 'utils/fp';
import uuid from 'uuid/v4';
import { suggestionNodeAttributes } from '../schema';

import {
	SuggestedEditsPluginState,
	SuggestedEditsTransactionContext,
	SuggestionAttrs,
	SuggestionKind,
	SuggestionNodeAttrs,
} from '../types';

export const createSuggestedEditsTransactionContext = (
	pluginState: SuggestedEditsPluginState,
): SuggestedEditsTransactionContext => {
	const {
		nodeHasSuggestion,
		nodeHasSuggestionKind,
		createMarkForSuggestionKind: baseCreateMarkForSuggestionKind,
		suggestionUserId,
		getMarkTypeForSuggestionKind,
	} = pluginState;
	const suggestionBaseAttrs: Pick<
		SuggestionAttrs,
		'suggestionUserId' | 'suggestionTimestamp' | 'suggestionDiscussionId'
	> = {
		suggestionUserId,
		suggestionTimestamp: Date.now(),
		suggestionDiscussionId: null,
	};

	const createMarkForSuggestionKind = (
		suggestionKind: SuggestionKind,
		suggestionOriginalMarks?: readonly Mark[],
	) => {
		return baseCreateMarkForSuggestionKind(
			suggestionKind,
			{ ...suggestionBaseAttrs, suggestionId: uuid() },
			suggestionOriginalMarks,
		);
	};

	return {
		nodeHasSuggestion,
		nodeHasSuggestionKind,
		createMarkForSuggestionKind,
		addSuggestionToRange: (tr: Transaction, from: number, to: number, kind: SuggestionKind) => {
			const mark = createMarkForSuggestionKind(kind);
			tr.addMark(from, to, mark);
		},
		removeSuggestionFromRange: (
			tr: Transaction,
			from: number,
			to: number,
			kind: SuggestionKind,
		) => {
			const markType = getMarkTypeForSuggestionKind(kind);
			tr.removeMark(from, to, markType);
		},
		addSuggestionToNode: (
			tr: Transaction,
			pos: number,
			currentNode: Node,
			suggestionKind: SuggestionKind,
			suggestionOriginalAttrs?: Attrs,
		) => {
			const originalAttrsPart = withValue(suggestionOriginalAttrs, (attrs) => {
				if (attrs && suggestionKind === 'modification') {
					const filteredAttrs: Record<string, any> = {};
					Object.keys(attrs).forEach((attrKey) => {
						if (!suggestionNodeAttributes.includes(attrKey)) {
							filteredAttrs[attrKey] = attrs[attrKey];
						}
					});
					return { suggestionOriginalAttrs: JSON.stringify(filteredAttrs) };
				}
				return null;
			});
			const allSuggestionAttrs: SuggestionNodeAttrs = {
				...suggestionBaseAttrs,
				...originalAttrsPart,
				suggestionKind,
				suggestionId: uuid(),
			};
			tr.setNodeMarkup(
				pos,
				null,
				{ ...currentNode.attrs, ...allSuggestionAttrs },
				currentNode.marks,
			);
		},
	};
};
