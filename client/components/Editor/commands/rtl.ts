import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Dispatch } from './types';
import { createCommandSpec } from './util';

type NodePos = { node: Node; pos: number };

type RtlDirection = null | boolean;

const rtlAttr = 'rtl';

const setRtlType = (rtl: RtlDirection): RtlDirection => (rtl === null ? true : null);

// applies unwrap to a set of all nodes from n to pos
const getSharedRtlType = (nodes: NodePos[]) => {
	const directionTypes = nodes.map(({ node }) => node.attrs[rtlAttr]);
	return directionTypes.every((type) => type === true);
};

const isRtlTarget = (node: Node) => {
	const { spec } = node.type;
	return spec.attrs && rtlAttr in spec.attrs;
};

const getRtlTargetNodes = (state: EditorState): NodePos[] => {
	const { selection, doc } = state;
	const rtlTargetNodes: NodePos[] = [];
	selection.ranges.forEach(({ $from, $to }) => {
		doc.nodesBetween($from.pos, $to.pos, (node: Node, pos: number) => {
			if (isRtlTarget(node)) {
				rtlTargetNodes.push({ pos, node });
			}
		});
	});

	return rtlTargetNodes;
};

const orientNodes = (
	nodes: NodePos[],
	state: EditorState,
	dispatch: Dispatch,
	attr: RtlDirection,
) => {
	const { tr } = state;

	nodes.forEach(({ pos, node }) =>
		tr.setNodeMarkup(pos, undefined, { ...node.attrs, [rtlAttr]: attr }),
	);
	dispatch(tr);
};

const createRtlCommandSpec = (direction: RtlDirection) => {
	return createCommandSpec((dispatch: Dispatch, state: EditorState) => {
		const rtlTargetNodes = getRtlTargetNodes(state);
		const sharedDirectionType = getSharedRtlType(rtlTargetNodes);
		const sharedDirectionAttr = sharedDirectionType ? true : null;
		const rtlAttrValue = setRtlType(sharedDirectionAttr);
		const canRun = rtlTargetNodes.length > 0;
		return {
			isActive: sharedDirectionAttr === direction,
			canRun,
			run: () => orientNodes(rtlTargetNodes, state, dispatch, rtlAttrValue),
		};
	});
};

export const rtlToggle = createRtlCommandSpec(true);
