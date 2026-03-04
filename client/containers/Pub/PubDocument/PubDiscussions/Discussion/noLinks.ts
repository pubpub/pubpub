import type { DOMOutputSpec, MarkSpec } from 'prosemirror-model';

// strip protocol, bracket dots so crawlers won't follow or index the url
const defangUrl = (href: string): string => {
	if (!href) return '';
	return href
		.replace(/^https?:\/\//, '')
		.replace(/\./g, '[.]');
};

export const noLinksMarks = {
	link: {
		inclusive: false,
		attrs: {
			href: { default: '' },
		},
		parseDOM: [
			{
				tag: 'span.defanged-link',
				getAttrs: (dom) => ({
					href: (dom.getAttribute('data-href') ?? '')
						.replace(/\[.\]/g, '.'),
				}),
			},
			{
				tag: 'a[href]',
				getAttrs: (dom) => ({
					href: dom.getAttribute('href'),
				}),
			},
		],
		toDOM: (node) => {
			return [
				'span',
				{
					class: 'defanged-link',
					'data-href': defangUrl(node.attrs.href),
				},
				0,
			] as DOMOutputSpec;
		},
	},
} satisfies Record<string, MarkSpec>;
