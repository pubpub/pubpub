import { DOMOutputSpec, Node } from 'prosemirror-model';
import { highlightTree, classHighlighter } from '@lezer/highlight';
import { parser as javascriptParser } from '@lezer/javascript';
import type { Tree } from '@lezer/common';

type Text = {
	type: string;
	value: string;
};

const fromLezer = (source: string, tree: Tree) => {
	const children: (DOMOutputSpec | Text)[] = [];
	let index = 0;

	highlightTree(tree as any, classHighlighter, (from, to, classes) => {
		if (from > index) {
			children.push({ type: 'text', value: source.slice(index, from) });
		}
		children.push(['span', { class: classes }]);
		/*
			type: 'element',
			tagName: 'span',
			properties: { className: classes },
			children: [{ type: 'text', value: source.slice(from, to) }],
		});
		*/

		index = to;
	});

	if (index < source.length) {
		children.push({ type: 'text', value: source.slice(index) });
	}

	return { type: 'root', children };
};

const renderStaticCode = (node: Node) => {
	const parsers = {
		javascript: javascriptParser,
	};
	const parser = parsers[node.attrs.lang];
	const tree = parser.parse(node.textContent);
	const root = fromLezer(node.textContent, tree);
	// const content = toHtml(tree);
	console.log({ root }, 'another reset');
	const renderedCode = '<div>testCodeStufff</div>';
	return [
		'div',
		{
			dangerouslySetInnerHTML: { __html: renderedCode },
		},
	] as DOMOutputSpec;
};

export default {
	code_block: {
		content: 'text*',
		group: 'block',
		attrs: {
			lang: { default: 'javascript' },
			id: { default: null },
		},
		code: true,
		selectable: false,
		parseDOM: [
			{
				tag: 'pre',
				getAttrs: (node) => {
					return {
						id: (node as Element).getAttribute('id'),
					};
				},
				preserveWhitespace: 'full',
			},
		],
		toDOM: (node: Node, { isReact } = { isReact: false }) =>
			isReact
				? renderStaticCode(node)
				: renderStaticCode(node) ||
				  ([
						'pre',
						{ ...(node.attrs.id && { id: node.attrs.id }) },
						['code', 0],
				  ] as DOMOutputSpec),
	},
	code: {
		parseDOM: [{ tag: 'code' }],
		toDOM: () => {
			return ['code'] as DOMOutputSpec;
		},
	},
};
