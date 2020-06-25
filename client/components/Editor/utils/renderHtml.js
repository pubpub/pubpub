import React from 'react';

export const renderHtmlChildren = (node, html, wrapperElement = 'span') => {
	const hasKey = node.attrs.key !== undefined;
	if (hasKey) {
		/* eslint-disable-next-line react/no-danger */
		return React.createElement(wrapperElement, {
			key: node.attrs.key,
			dangerouslySetInnerHTML: { __html: html },
		});
	}

	const outputElem = document.createElement(wrapperElement);
	outputElem.innerHTML = html;
	return outputElem;
};
