import { EditorState } from 'prosemirror-state';

import { LanguageName } from '../utils';
import { createCommandSpec } from './util';
import { Dispatch } from './types';

const isInCodeBlock = (state: EditorState): boolean => {
	const { $anchor } = state.selection;
	for (let d = $anchor.depth; d > 0; d--)
		if ($anchor.node(d).type.name === 'code_block') return true;
	return false;
};

const setLanguage = (language: LanguageName) => (state: EditorState, dispatch?: Dispatch) => {
	const canRun = isInCodeBlock(state);
	if (!canRun) {
		return false;
	}
	if (dispatch) {
		const transaction = state.tr.setNodeMarkup(state.selection.$anchor.pos - 1, null, {
			language,
		});
		dispatch(transaction);
	}
	return true;
};

export const setLanguageCommandBuilder = (language: LanguageName) =>
	createCommandSpec((dispatch, state) => ({
		run: () => setLanguage(language)(state, dispatch),
		canRun: setLanguage(language)(state),
		isActive: false,
	}));
