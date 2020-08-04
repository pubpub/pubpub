import { Plugin } from 'prosemirror-state';

import { DecorationSet, Decoration } from 'prosemirror-view';
import { ReactiveStateStore } from './store';
import { reactivePluginKey } from './key';
import { createReactiveNodeViews } from './nodeView';

const handleReactiveResolveTransaction = (txn) => {
	const reactiveTransaction = txn.getMeta(reactivePluginKey);
	if (reactiveTransaction) {
		const { invalidateNodeId } = reactiveTransaction;
		if (invalidateNodeId) {
			return invalidateNodeId;
		}
	}
	return null;
};

const createReactiveDecorationForNode = (from, to, cycleId, count) =>
	Decoration.node(from, to, { 'reactive-update': `${cycleId}-${count}` });

export default (schema) => {
	return new Plugin({
		key: reactivePluginKey,
		state: {
			init: (_, editorState) => {
				return {
					store: new ReactiveStateStore(schema.nodes),
					decorations: DecorationSet.create(editorState.doc, []),
					nodeViews: createReactiveNodeViews(schema),
				};
			},
			apply: (transaction, state, _, newEditorState) => {
				const { store } = state;
				const cycleId = Date.now();
				const storeTxn = store.startTransaction();
				const nextDecorations = [];
				const invalidatedNodeId = handleReactiveResolveTransaction(transaction);
				newEditorState.doc.descendants((node, offset) => {
					const updated = storeTxn.updateNode(node);
					if (updated || invalidatedNodeId === node.id) {
						nextDecorations.push(
							createReactiveDecorationForNode(
								offset,
								offset + node.nodeSize,
								cycleId,
								nextDecorations.length,
							),
						);
					}
				});
				return {
					...state,
					decorations: DecorationSet.create(newEditorState.doc, nextDecorations),
				};
			},
		},
		props: {
			decorations: (editorState) => {
				return reactivePluginKey.getState(editorState).decorations;
			},
		},
	});
};
