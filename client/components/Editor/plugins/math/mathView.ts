import { Fragment, Node } from 'prosemirror-model';
import { EditorView, NodeView, Decoration, DecorationSet } from 'prosemirror-view';

type NodeViewArgs = [Node, EditorView, boolean | (() => number), Decoration[]];
type NodeViewConstructor = (...args: NodeViewArgs) => NodeView;

const addCountToNode = (node: Node, count: number) => {
	const {
		content,
		type: { schema },
	} = node;
	const countLatex = `\\tag{${count}}`;
	const textNode = schema.text(countLatex);
	const contentWithCount = Fragment.from(content).append(Fragment.from(textNode));
	return contentWithCount;
};

export const mathViewOverrideWithCount = (constructor: NodeViewConstructor) => {
	console.log('override called');
	return (...args: NodeViewArgs) => {
		const delegate = constructor(...args);
		const { update } = delegate;
		const boundUpdate = update!.bind(delegate);
		console.log('NodeView instantiated');
		Object.assign(delegate, {
			update: (node: Node, decorations: Decoration[], innerDecorations: DecorationSet) => {
				// We should have access to the `count` reactive attr if node labels for math
				// are currently enabled
				const { count } = node.attrs;
				console.log('updating with count', count);
				const updatedNode = count ? addCountToNode(node, count) : node;
				return boundUpdate(updatedNode, decorations, innerDecorations);
			},
		});
		return delegate;
	};
};
