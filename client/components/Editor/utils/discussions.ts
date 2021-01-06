import { DecorationSet, EditorView } from 'prosemirror-view';

import { discussionsPluginKey } from '../plugins/discussions';

export const getDiscussionDecorations = (view: EditorView): null | DecorationSet => {
	const pluginState = discussionsPluginKey.getState(view.state);
	if (pluginState) {
		return pluginState.decorations || null;
	}
	return null;
};
