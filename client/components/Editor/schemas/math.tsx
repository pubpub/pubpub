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
		toDOM: () => ['math-inline', { class: 'math-node' }, 0] as const,
	},
	math_display: {
		...mathDisplaySchema,
		group: 'block math',
		toDOM: () => ['math-display', { class: 'math-node' }, 0] as const,
	},
};
