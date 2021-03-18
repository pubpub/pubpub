import { Node, NodeType } from 'prosemirror-model';
import { NodeSelection, EditorState } from 'prosemirror-state';
import { lift, setBlockType, wrapIn } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';

import { Attrs, Dispatch } from './types';
import { createCommandEntry } from './util';

const nodeMatchesTypeAndAttrs = (node: Node, type: NodeType, attrs: Attrs) => {
	if (node.type === type) {
		return Object.keys(attrs).every((key) => attrs[key] === node.attrs[key]);
	}
	return false;
};

const blockTypeIsActive = (state: EditorState, type: NodeType, matchingAttrs: Attrs = {}) => {
	if (!type) {
		return false;
	}
	const { $from } = state.selection;
	const selectedNode = (state.selection as NodeSelection).node;

	if (selectedNode && nodeMatchesTypeAndAttrs(selectedNode, type, matchingAttrs)) {
		return true;
	}

	let currentDepth = $from.depth;
	while (currentDepth > 0) {
		const currentNodeAtDepth = $from.node(currentDepth);
		if (nodeMatchesTypeAndAttrs(currentNodeAtDepth, type, matchingAttrs)) {
			return true;
		}
		currentDepth -= 1;
	}

	return false;
};

const toggleBlockType = (
	state: EditorState,
	type: NodeType,
	attrs: Attrs = {},
	dispatch: undefined | Dispatch = undefined,
) => {
	const { schema } = state;
	const isActive = blockTypeIsActive(state, type, attrs);
	const newNodeType = isActive ? schema.nodes.paragraph : type;
	const setBlockFunction = setBlockType(newNodeType, attrs);
	return setBlockFunction(state, dispatch);
};

const toggleWrap = (state: EditorState, type: NodeType, dispatch: Dispatch = undefined) => {
	if (blockTypeIsActive(state, type)) {
		return lift(state, dispatch);
	}
	return wrapIn(type)(state, dispatch);
};

const toggleWrapList = (state: EditorState, type: NodeType, dispatch: Dispatch = undefined) => {
	if (blockTypeIsActive(state, type)) {
		return lift(state, dispatch);
	}
	return wrapInList(type)(state, dispatch);
};

const createBlockTypeToggle = (key: string, nodeTypeName: string = key, withAttrs: Attrs = {}) => {
	return createCommandEntry((dispatch, state) => {
		const nodeType = state.schema.nodes[nodeTypeName];
		return {
			key,
			run: () => toggleBlockType(state, nodeType, withAttrs, dispatch),
			canRun: toggleBlockType(state, nodeType, withAttrs),
			isActive: nodeType && blockTypeIsActive(state, nodeType, withAttrs),
		};
	});
};

export const createHeadingBlockTypeToggle = (level: number) => {
	const key = `heading${level}`;
	return createBlockTypeToggle(key, 'heading', { level });
};

export const paragraphToggle = createBlockTypeToggle('paragraph');
export const codeBlockToggle = createBlockTypeToggle('code_block');

export const heading1Toggle = createHeadingBlockTypeToggle(1);
export const heading2Toggle = createHeadingBlockTypeToggle(2);
export const heading3Toggle = createHeadingBlockTypeToggle(3);
export const heading4Toggle = createHeadingBlockTypeToggle(4);
export const heading5Toggle = createHeadingBlockTypeToggle(5);
export const heading6Toggle = createHeadingBlockTypeToggle(6);
