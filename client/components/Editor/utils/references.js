import { getReactedCopyOfNode } from '@pubpub/prosemirror-reactive';

const referenceTypes = [
	{
		bpDisplayIcon: 'media',
		type: 'figure',
		nodeTypes: ['image', 'video', 'audio'],
		label: 'Figure',
	},
];

export const defaultCountDeriver = (node) => node.attrs.count;

const getReferenceForNode = (node, editorState) => {
	const {
		type: {
			name: nodeType,
			spec: { reactive },
		},
	} = node;
	const referenceType = referenceTypes.find((type) => type.nodeTypes.includes(nodeType));
	if (referenceType) {
		const { deriveCount = defaultCountDeriver } = referenceType;
		const resolvedNode = reactive ? getReactedCopyOfNode(node, editorState) : node;
		if (resolvedNode) {
			const count = deriveCount(resolvedNode);
			return {
				node: node,
				referenceType: referenceType,
				label: `${referenceType.label} ${count}`,
			};
		}
	}
	return null;
};

export const getReferenceableNodes = (editorState) => {
	const nodes = [];
	editorState.doc.descendants((node) => {
		if (node.attrs && node.attrs.id) {
			const reference = getReferenceForNode(node, editorState);
			if (reference) {
				nodes.push(reference);
			}
		}
	});
	return nodes;
};
