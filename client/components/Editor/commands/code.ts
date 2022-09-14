import { EditorState, Command } from 'prosemirror-state';

import { createCommandSpec } from './util';
import { Dispatch } from './types';

const isInCodeBlock = (state): boolean => {
	const { $anchor } = state.selection;
	for (let d = $anchor.depth; d > 0; d--)
		if ($anchor.node(d).type.name === 'code_block') return true;
	return false;
};

const setLanguage: Command = (state: EditorState, dispatch?: Dispatch) => {
	const canRun = isInCodeBlock(state);
	if (!canRun) {
		return false;
	}
	if (dispatch) {
		console.log('dispatched');
	}
	return true;
};

export const codeSetLanguage = createCommandSpec((dispatch, state) => ({
	run: () => setLanguage(state, dispatch),
	canRun: setLanguage(state),
	isActive: false,
}));
