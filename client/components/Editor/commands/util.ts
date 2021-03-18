import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CommandEntryBuilder } from './types';

export const createCommandEntry = (builder: CommandEntryBuilder) => {
	return (view: EditorView) => (state: EditorState) => builder(view.dispatch, state);
};
