import { DOMSerializer } from 'prosemirror-model';

import { reactivePluginKey } from './key';

const getNodeWithReactiveAttrs = (node, editorView) => {
	const {
		store: { nodes },
	} = reactivePluginKey.getState(editorView.state);
	const { attrs } = node;
	const nodeCopy = node.copy();
	const reactiveAttrs = nodes[attrs.id] && nodes[attrs.id].reactiveAttrs;
	nodeCopy.attrs = { ...nodeCopy.attrs, ...reactiveAttrs };
	return nodeCopy;
};

export const createReactiveNodeViews = (schema) => {
	const views = {};
	Object.values(schema.nodes).forEach((nodeType) => {
		const { name, spec } = nodeType;
		if (spec.reactive) {
			views[name] = (node, editorView) => {
				const nodeCopy = getNodeWithReactiveAttrs(node, editorView);
				const outputSpec = spec.toDOM(nodeCopy);
				const { dom, contentDOM } = DOMSerializer.renderSpec(document, outputSpec);
				return {
					dom: dom,
					contentDOM: contentDOM,
					update: () => false,
				};
			};
		}
	});
	return views;
};
