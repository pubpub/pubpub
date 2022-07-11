import { DOMOutputSpec, Node } from 'prosemirror-model';

import { counter } from './reactive/counter';

// don't change this object; necessary for prosmirror-math package
const inlineMathSchema = {
	content: 'text*',
	inline: true,
	atom: true,
	parseDOM: [
		{
			tag: 'math-inline', // important!
		},
	],
};

// don't change this object; necessary for prosmirror-math package
const mathDisplaySchema = {
	content: 'text*',
	atom: true,
	code: true,
	parseDOM: [
		{
			tag: 'math-display',
		},
	],
};

export default {
	math_inline: {
		...inlineMathSchema,
		group: 'inline math',
		toDOM: () => ['math-inline', { class: 'math-node' }, 0] as DOMOutputSpec,
	},
	math_display: {
		...mathDisplaySchema,
		reactive: true,
		group: 'block math',
		attrs: {
			id: { default: null },
			hideLabel: { default: false },
		},
		reactiveAttrs: {
			count: counter({ useNodeLabels: true }),
		},
		toDOM: () => ['math-display', { class: 'math-node' }, 0] as DOMOutputSpec,
	},
};
