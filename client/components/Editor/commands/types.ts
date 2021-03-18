import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export type Dispatch = EditorView['dispatch'];
export type Attrs = Record<string, any>;

export type CommandEntry = {
	key: string;
	run: () => unknown;
	canRun: boolean;
	isActive: boolean;
};

export type CommandEntryBuilder = (dispatch: Dispatch, state: EditorState) => CommandEntry;
