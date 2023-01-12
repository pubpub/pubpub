import { Node, Mark, Schema, Attrs } from 'prosemirror-model';
import uuid from 'uuid/v4';

import { withValue } from 'utils/fp';

import { suggestionNodeAttributes } from './schema';
import {
	SuggestedEditsTransactionContext,
	SuggestionAttrsPerTransaction,
	SuggestionKind,
	SuggestionMarkAttrs,
	SuggestionNodeAttrs,
	SuggestionUniqueAttrs,
} from './types';

const getMarkTypeForSuggestionKind = (schema: Schema, kind: SuggestionKind) => {
	const { suggestion_addition, suggestion_removal, suggestion_modification } = schema.marks;
	if (kind === 'addition') {
		return suggestion_addition;
	}
	if (kind === 'removal') {
		return suggestion_removal;
	}
	return suggestion_modification;
};

const createSuggestionUniqueAttrs = (): SuggestionUniqueAttrs => {
	return {
		suggestionId: uuid(),
	};
};

export const nodeHasSuggestion = (node: Node) => {
	const {
		type: { schema },
	} = node;
	const { suggestion_addition, suggestion_removal, suggestion_modification } = schema.marks;
	return (
		!!node.attrs.suggestionKind ||
		node.marks.some(
			(mark) =>
				mark.type === suggestion_addition ||
				mark.type === suggestion_removal ||
				mark.type === suggestion_modification,
		)
	);
};

export const nodeHasSuggestionKind = (node: Node, kind: SuggestionKind) => {
	const {
		type: { schema },
	} = node;
	if (node.attrs.suggestionKind === kind) {
		return true;
	}
	const markForKind = getMarkTypeForSuggestionKind(schema, kind);
	return node.marks.some((mark) => mark.type === markForKind);
};

export const createMarkForSuggestionKind = (
	suggestionKind: SuggestionKind,
	schema: Schema,
	transactionAttrs: SuggestionAttrsPerTransaction,
	suggestionOriginalMarks?: readonly Mark[],
) => {
	const markType = getMarkTypeForSuggestionKind(schema, suggestionKind);
	const originalMarksAttrs = withValue(suggestionOriginalMarks, (marks) => {
		if (marks) {
			const asJson = marks.map((mark) => mark.toJSON());
			return { originalMarks: JSON.stringify(asJson) };
		}
		return {};
	});
	const markAttrs: SuggestionMarkAttrs = {
		...createSuggestionUniqueAttrs(),
		...transactionAttrs,
		...originalMarksAttrs,
		suggestionDiscussionId: null,
	};
	return markType.create(markAttrs);
};

export const addSuggestionToRange = (
	suggestionKind: SuggestionKind,
	context: SuggestedEditsTransactionContext,
	from: number,
	to: number,
) => {
	const { newTransaction, transactionAttrs, schema } = context;
	const newMark = createMarkForSuggestionKind(suggestionKind, schema, transactionAttrs);
	newTransaction.addMark(from, to, newMark);
};

export const removeSuggestionFromRange = (
	suggestionKind: SuggestionKind,
	context: SuggestedEditsTransactionContext,
	from: number,
	to: number,
) => {
	const { newTransaction, schema } = context;
	const markType = getMarkTypeForSuggestionKind(schema, suggestionKind);
	newTransaction.removeMark(from, to, markType);
};

export const addSuggestionToNode = (
	suggestionKind: SuggestionKind,
	context: SuggestedEditsTransactionContext,
	pos: number,
	currentNode: Node,
	suggestionOriginalAttrs?: Attrs,
) => {
	const { newTransaction, transactionAttrs } = context;
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
		...createSuggestionUniqueAttrs(),
		...transactionAttrs,
		...originalAttrsPart,
		suggestionKind,
		suggestionDiscussionId: null,
	};
	newTransaction.setNodeMarkup(
		pos,
		null,
		{ ...currentNode.attrs, ...allSuggestionAttrs },
		currentNode.marks,
	);
};
