export const getCitationInlineLabel = (count, customLabel, citationInlineStyle, citationData) => {
	if (customLabel) {
		return customLabel;
	}
	if (citationData && citationData.inline && citationData.inline[citationInlineStyle]) {
		return citationData.inline[citationInlineStyle];
	}
	return `[${count}]`;
};

export const citation = {
	atom: true,
	reactive: true,
	attrs: {
		value: { default: '' },
		unstructuredValue: { default: '' },
		customLabel: { default: '' },
	},
	reactiveAttrs: {
		count: countCell(({ attrs }) => [attrs.structuredValue, attrs.unstructuredValue]),
		structuredContents: promiseCell({
			createPromise: (node) => {
                const {type: {spec}, attrs} = node;
                const {options: {resolveCitable}} = spec;
                return resolveCitable(attrs.structuredValue);
            },
			invalidateOn: ({ attrs }) => [attrs.structuredValue],
			holdLastValue: true,
		}),
	},
	parseDOM: [
		{
			tag: 'span',
			getAttrs: (node) => {
				if (node.getAttribute('data-node-type') !== 'citation') {
					return false;
				}
				return {
					value: node.getAttribute('data-value') || '',
					unstructuredValue: node.getAttribute('data-unstructured-value') || '',
					label: node.getAttribute('data-label') || '',
				};
			},
		},
	],
	toDOM: (node, dynamicState) => {
		const { href, id, count, customLabel } = node.attrs;
		const labelString = getCitationInlineLabel(
			count,
			customLabel,
			citationInlineStyle,
			citationsRef.current[count - 1],
		);
		return [
			href ? 'a' : 'span',
			{
				...(href && { href: href }),
				...(id && { id: id }),
				'data-node-type': 'citation',
				'data-value': node.attrs.value,
				'data-unstructured-value': node.attrs.unstructuredValue,
				'data-count': node.attrs.count,
				'data-label': node.attrs.label,
				class: 'citation',
			},
			labelString,
		];
	},
	inline: true,
	group: 'inline',

	/* These are not part of the standard Prosemirror Schema spec */
	onInsert: (view, attrs) => {
		const citationNode = view.state.schema.nodes.citation.create(attrs);
		const transaction = view.state.tr.replaceSelectionWith(citationNode);
		view.dispatch(transaction);
	},
	defaultOptions: {
		citationsRef: { current: [] },
		citationInlineStyle: 'count',
	},
	withDynamicState: true,
});
