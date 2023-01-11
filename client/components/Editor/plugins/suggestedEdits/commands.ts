import { Command, EditorState } from 'prosemirror-state';

import { Dispatch, createCommandSpec } from '../../commands';
import { suggestedEditsPluginKey } from './plugin';

import { isSuggestedEditsEnabled, updateSuggestedEditsState } from './state';

const toggleSuggestedEditsCommand: Command = (state: EditorState, dispatch?: Dispatch) => {
	const pluginState = suggestedEditsPluginKey.getState(state);
	if (pluginState) {
		if (dispatch) {
			updateSuggestedEditsState(dispatch, state, { isEnabled: !pluginState.isEnabled });
		}
		return true;
	}
	return false;
};

export const toggleSuggestedEdits = createCommandSpec((dispatch, state) => {
	const isEnabled = isSuggestedEditsEnabled(state);
	return {
		isActive: isEnabled,
		canRun: toggleSuggestedEditsCommand(state),
		run: () => toggleSuggestedEditsCommand(state, dispatch),
	};
});
