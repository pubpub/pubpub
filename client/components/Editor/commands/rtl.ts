import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Dispatch } from './types';
import { createCommandSpec } from './util';

type NodePos = { node: Node; pos: number };
const directionAttr = 'rtl';

// or type is attr?
const getDirectionValue = (direction: string) => {
	return direction === 'ltr' ? null : direction;
};

// what nodes able to be rtl, not sure, how to check?

const isRtlTarget = (node: Node) => {
	const { spec } = node.type;
	return spec.attrs && directionAttr in spec.attrs;
};

// nodes could be in ltr or rtl
const getDirectionNodes = (state: EditorState): NodePos[] => {
	const { selection, doc } = state;
	const alignableNodes: NodePos[] = [];
	selection.ranges.forEach(({ $from, $to }) => {
		doc.nodesBetween($from.pos, $to.pos, (node: Node, pos: number) => {
			if (isRtlTarget(node)) {
				alignableNodes.push({ pos, node });
			}
		});
	});

	return alignableNodes;
};

const orientNodes = (
	nodes: NodePos[],
	state: EditorState,
	dispatch: Dispatch,
	attr: string | null,
) => {
	const { tr } = state;
	nodes.forEach(({ pos, node }) =>
		tr.setNodeMarkup(pos, undefined, { ...node.attrs, [directionAttr]: attr }),
	);
	dispatch(tr);
};

const createDirectionCommandSpec = (direction: string) => {
	return createCommandSpec((dispatch: Dispatch, state: EditorState) => {
		const nodes = getDirectionNodes(state);
		const canRun = true; // not sure ?
		const directionAttrValue = getDirectionValue(direction);

		return {
			isActive: false,
			canRun,
			run: () => orientNodes(nodes, state, dispatch, directionAttrValue),
		};
	});
};

export const rtlToggle = createDirectionCommandSpec('rtl');
