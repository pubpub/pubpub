import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Dispatch } from './types';
import { createCommandSpec } from './util';

type NodePos = { node: Node; pos: number };

type RtlDirection = null | true;

const rtlAttr = 'rtl';

const setRtlType = (rtl: RtlDirection): RtlDirection => (rtl === null ? true : null);

// applies unwrap to a set of all nodes from n to pos
const getSharedRtlType = (nodes: NodePos[]) => {
	const directionTypes = nodes.map(({ node }) => node.attrs[rtlAttr]);
	const directionTypesSet = new Set(directionTypes);
	if (directionTypesSet.size === 1) {
		return [...directionTypesSet][0];
	}
	return null;
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
	const rtlAttrValue = setRtlType(attr);

	nodes.forEach(({ pos, node }) =>
		tr.setNodeMarkup(pos, undefined, { ...node.attrs, [rtlAttr]: rtlAttrValue }),
	);
	dispatch(tr);
};

const createRtlCommandSpec = (direction: RtlDirection) => {
	return createCommandSpec((dispatch: Dispatch, state: EditorState) => {
		const rtlTargetNodes = getRtlTargetNodes(state);
		const sharedDirectionType = getSharedRtlType(rtlTargetNodes);
		const canRun = rtlTargetNodes.length > 0;
		return {
			isActive: sharedDirectionType === direction,
			canRun,
			run: () => orientNodes(rtlTargetNodes, state, dispatch, sharedDirectionType),
		};
	});
};

export const rtlToggle = createRtlCommandSpec(true);
