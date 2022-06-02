import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Dispatch } from './types';
import { createCommandSpec } from './util';

type NodePos = { node: Node; pos: number };
type RtlDirection = true | null;
type AlignableNodesResult = {
	rtlTargetNodes: NodePos[];
	sharedAlignmentType: RtlDirection;
};
const rtlAttr = 'rtl';

const setRtlType = (rtl: RtlDirection): RtlDirection => (rtl === null ? null : true);

const unwrapRtlValue = (value: RtlDirection): RtlDirection => (value === null ? true : value);

const getSharedRtlType = (nodes: NodePos[]) => {
	const directionTypes = nodes.map(({ node }) => unwrapRtlValue(node.attrs[rtlAttr]));
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

// nodes could be in ltr or rtl
const getRtlTargetNodes = (state: EditorState): AlignableNodesResult => {
	const { selection, doc } = state;
	const rtlTargetNodes: NodePos[] = [];
	selection.ranges.forEach(({ $from, $to }) => {
		doc.nodesBetween($from.pos, $to.pos, (node: Node, pos: number) => {
			if (isRtlTarget(node)) {
				rtlTargetNodes.push({ pos, node });
			}
		});
	});
	const result = {
		rtlTargetNodes,
		sharedAlignmentType: getSharedRtlType(rtlTargetNodes),
	};

	return result;
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
		const { rtlTargetNodes, sharedAlignmentType } = getRtlTargetNodes(state);
		const canRun = rtlTargetNodes.length > 0;
		return {
			isActive: sharedAlignmentType === direction,
			canRun,
			run: () => orientNodes(rtlTargetNodes, state, dispatch, sharedAlignmentType),
		};
	});
};
export const rtlToggle = createRtlCommandSpec(true);
