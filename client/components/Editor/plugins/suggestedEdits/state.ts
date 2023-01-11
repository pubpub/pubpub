import { Node, Mark, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { withValue } from 'utils/fp';
import { Dispatch } from '../../commands';

import { suggestedEditsPluginKey } from './plugin';
import { SuggestedEditsPluginState, SuggestionKind, SuggestionMarkAttrs } from './types';

export const getInitialPluginState = (
	schema: Schema,
	suggestionUserId: string,
): SuggestedEditsPluginState => {
	const {
		suggestion_addition: additionMark,
		suggestion_removal: removalMark,
		suggestion_modification: modificationMark,
	} = schema.marks;
	const getMarkTypeForSuggestionKind = (kind: SuggestionKind) => {
		if (kind === 'addition') {
			return additionMark;
		}
		if (kind === 'removal') {
			return removalMark;
		}
		return modificationMark;
	};
	return {
		isEnabled: false,
		suggestionUserId,
		getMarkTypeForSuggestionKind,
		nodeHasSuggestion: (node: Node) => {
			return (
				!!node.attrs.suggestionKind ||
				node.marks.some(
					(mark) =>
						mark.type === additionMark ||
						mark.type === removalMark ||
						mark.type === modificationMark,
				)
			);
		},
		nodeHasSuggestionKind: (node: Node, kind: SuggestionKind) => {
			if (node.attrs.suggestionKind === kind) {
				return true;
			}
			const markForKind = getMarkTypeForSuggestionKind(kind);
			return node.marks.some((mark) => mark.type === markForKind);
		},
		createMarkForSuggestionKind: (
			suggestionKind: SuggestionKind,
			attrs: Exclude<SuggestionMarkAttrs, 'suggestionOriginalMarks'>,
			suggestionOriginalMarks?: readonly Mark[],
		) => {
			const markType = getMarkTypeForSuggestionKind(suggestionKind);
			const originalMarksAttrs = withValue(suggestionOriginalMarks, (marks) => {
				if (marks) {
					const asJson = marks.map((mark) => mark.toJSON());
					return { originalMarks: JSON.stringify(asJson) };
				}
				return {};
			});
			return markType.create({ ...originalMarksAttrs, ...attrs });
		},
	};
};

export const getSuggestedEditsState = (state: EditorState): null | SuggestedEditsPluginState => {
	return suggestedEditsPluginKey.getState(state);
};

export const isSuggestedEditsEnabled = (state: EditorState) => {
	const pluginState = getSuggestedEditsState(state);
	if (pluginState) {
		return pluginState.isEnabled;
	}
	return false;
};

export const updateSuggestedEditsState = (
	dispatch: Dispatch,
	editorState: EditorState,
	updatedState: Partial<SuggestedEditsPluginState>,
) => {
	const { tr } = editorState;
	tr.setMeta(suggestedEditsPluginKey, { updatedState });
	dispatch(tr);
};
