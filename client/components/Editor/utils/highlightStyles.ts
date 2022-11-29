import { defaultHighlightStyle, HighlightStyle } from '@codemirror/language';

import { DocJson } from 'types';

type HighlightStylesMap = Record<string, HighlightStyle>;

const getCodeBlockHighlightStyles = (doc: DocJson) => {
	const hasSomeCodeBlocks = doc.content.some((node) => node.type === 'code_block');
	return {
		...(hasSomeCodeBlocks && { code_block: defaultHighlightStyle }),
	};
};

export const getHighlightStylesFromDoc = (doc: DocJson): HighlightStylesMap => {
	const highlightStyles: HighlightStylesMap = {
		...getCodeBlockHighlightStyles(doc),
	};
	return highlightStyles;
};
