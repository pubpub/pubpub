import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import juice from 'juice';
import beautify from 'js-beautify';

import { reset, globals } from './styles';

const inlineStylesWithMarkup = (EmailMarkup: React.ReactNode, extraStyles: string) => {
	const stylesheet = new ServerStyleSheet();
	const renderedStringFromEmailMarkup = ReactDOMServer.renderToStaticMarkup(
		<StyleSheetManager sheet={stylesheet.instance}>{EmailMarkup}</StyleSheetManager>,
	);
	const basicMarkup = beautify.html(renderedStringFromEmailMarkup);
	const basicStyles = stylesheet.getStyleTags();

	return juice(`<head><meta charset="utf-8"/>${basicStyles}</head>${basicMarkup}`, {
		extraCss: `${reset} ${globals} ${extraStyles}`,
	});
};

export const render = (EmailMarkup: React.ReactNode, extraStyles = '') => {
	return `<html lang="en">${inlineStylesWithMarkup(EmailMarkup, extraStyles)}</html>`;
};
