import { Node, NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

const nodeMatchesTypeAndAttrs = (node: Node, type: NodeType, attrs: Record<string, any>) => {
	if (node.type === type) {
		return Object.keys(attrs).every((key) => attrs[key] === node.attrs[key]);
	}
	return false;
};

const blockTypeIsActive = (
	editorView: EditorView,
	type: NodeType,
	matchingAttrs: Record<string, any> = {},
) => {
	if (!type) {
		return false;
	}
	const $from = editorView.state.selection.$from;
	const selectedNode = (editorView.state.selection as any).node;
	const isActive = false;

	if (selectedNode) {
		nodeMatchesTypeAndAttrs(selectedNode);
	}

	let currentDepth = $from.depth;
	while (currentDepth > 0) {
		const currentNodeAtDepth = $from.node(currentDepth);
		nodeMatchesTypeAndAttrs(currentNodeAtDepth);
		currentDepth -= 1;
	}

	return isActive;
};
