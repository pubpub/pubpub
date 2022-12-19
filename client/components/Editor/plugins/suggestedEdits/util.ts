import { EditorState } from 'prosemirror-state';

import { Dispatch } from '../../commands';

import { suggestedEditsPluginKey } from './plugin';
import { SuggestedEditsPluginState } from './types';

export const isSuggestedEditsEnabled = (state: EditorState) => {
	const pluginState = suggestedEditsPluginKey.getState(state);
	if (pluginState) {
		return !!pluginState.isEnabled;
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
