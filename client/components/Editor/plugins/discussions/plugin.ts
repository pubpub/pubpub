import { Node } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';

import { PluginsOptions, CollaborativeOptions } from '../../types';
import { getDecorationsForUpdateResult } from './decorations';
import { connectToDraftDiscussions } from './draftDiscussions';
import { DiscussionsUpdateResult, DiscussionInfo } from './types';

export const discussionsPluginKey = new PluginKey('discussions');

type SyncDraftDiscussions = ReturnType<typeof connectToDraftDiscussions>;

type SharedPluginState = {
	decorations: DecorationSet;
};

type PluginState = SharedPluginState & {
	addDiscussion: SyncDraftDiscussions['addDiscussion'];
};

const createDraftPlugin = (collaborativeOptions: CollaborativeOptions, initialDoc: Node) => {
	let editorView: null | EditorView = null;

	const draftDiscussions = connectToDraftDiscussions({
		draftRef: collaborativeOptions.firebaseRef,
		initialHistoryKey: collaborativeOptions.initialDocKey,
		initialDoc: initialDoc,
		onUpdateDiscussions: (updateResult: DiscussionsUpdateResult) => {
			if (editorView) {
				const { tr } = editorView.state;
				tr.setMeta(discussionsPluginKey, { updateResult: updateResult });
				editorView.dispatch(tr);
			}
		},
	});

	const getUpdateResult = (
		tr: Transaction,
		editorState: EditorState,
	): null | DiscussionsUpdateResult => {
		const meta = tr.getMeta(discussionsPluginKey);
		if (meta && meta.updateResult) {
			return meta.updateResult;
		}
		return draftDiscussions.handleTransaction(tr, editorState);
	};

	const init = (): PluginState => {
		return {
			decorations: DecorationSet.create(initialDoc, []),
			addDiscussion: draftDiscussions.addDiscussion,
		};
	};

	const apply = (tr: Transaction, pluginState: PluginState, editorState: EditorState) => {
		const updateResult = getUpdateResult(tr, editorState);
		if (updateResult) {
			return {
				...pluginState,
				decorations: getDecorationsForUpdateResult(pluginState.decorations, updateResult),
			};
		}
		return pluginState;
	};

	return new Plugin({
		key: discussionsPluginKey,
		state: { init: init, apply: apply },
		view: (view) => {
			editorView = view;
			return {
				destroy: () => {
					draftDiscussions.disconnect();
				},
			};
		},
		props: {
			decorations: (editorState: EditorState) => {
				const pluginState = discussionsPluginKey.getState(editorState) as PluginState;
				return pluginState.decorations;
			},
		},
	});
};

export default (_, options: PluginsOptions) => {
	const { collaborativeOptions, initialDoc } = options;
	if (collaborativeOptions) {
		return createDraftPlugin(collaborativeOptions, initialDoc);
	}
	return [];
};

export const addDiscussionToView = (
	view: EditorView,
	id: string,
	selection: DiscussionInfo['selection'],
) => {
	const pluginState = discussionsPluginKey.getState(view.state) as null | PluginState;
	if (pluginState) {
		return pluginState.addDiscussion(id, selection);
	}
	return null;
};
