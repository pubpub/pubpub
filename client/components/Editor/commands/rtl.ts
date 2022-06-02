import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { Dispatch } from './types';
import { createCommandSpec } from './util';

type NodePos = { node: Node; pos: number };
type RtlDirectionType = null | true;
type RtlDirectionValue = null | true;
type AlignableNodesResult = {
	rtlTargetNodes: NodePos[];
	sharedDirectionType: RtlDirectionType;
};
const rtlAttr = 'rtl';

// if the orientaion is ltr keep them that way else return true
const wrapRtlType = (rtl: RtlDirectionType): RtlDirectionValue => (rtl === null ? null : rtl);

const unwrapRtlValue = (value: RtlDirectionValue): RtlDirectionType =>
	value === null ? null : true;

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
		sharedDirectionType: getSharedRtlType(rtlTargetNodes),
	};

	return result;
};

const orientNodes = (
	nodes: NodePos[],
	state: EditorState,
	dispatch: Dispatch,
	attr: RtlDirectionType,
) => {
	const { tr } = state;
	const rtlAttrValue = wrapRtlType(attr);

	nodes.forEach(({ pos, node }) =>
		tr.setNodeMarkup(pos, undefined, { ...node.attrs, [rtlAttr]: rtlAttrValue }),
	);
	dispatch(tr);
};

const createRtlCommandSpec = (direction: RtlDirectionType) => {
	return createCommandSpec((dispatch: Dispatch, state: EditorState) => {
		const { rtlTargetNodes, sharedDirectionType } = getRtlTargetNodes(state);
		console.log(sharedDirectionType);
		const canRun = rtlTargetNodes.length > 0;
		return {
			isActive: sharedDirectionType === direction,
			canRun,
			run: () => orientNodes(rtlTargetNodes, state, dispatch, sharedDirectionType),
		};
	});
};
export const rtlToggle = createRtlCommandSpec(true);
