import React from 'react';
import app from 'server/server';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import juice from 'juice';
import { handleErrors } from 'server/utils/errors';
import { hostIsValid } from 'server/utils/routes';
import { minify } from 'html-minifier';

import { Digest } from 'components/Email';
import { reset, globals } from 'components/Email/styles';

const communityData = {
	communityColor: 'tomato',
	activityItems: [{ text: 'test text' }],
};

const inlineStylesWithMarkup = (emailMarkup: React.ReactNode, extraStyles: string) => {
	const stylesheet = new ServerStyleSheet();
	const renderedStringFromEmailMarkup = ReactDOMServer.renderToString(
		<StyleSheetManager sheet={stylesheet.instance}>{emailMarkup}</StyleSheetManager>,
	);
	const basicStyles = stylesheet.getStyleTags();
	const fullSize = juice(
		`<head><meta charset="utf-8"/>${basicStyles}</head>${renderedStringFromEmailMarkup}`,
		{
			extraCss: `${reset} ${globals} ${extraStyles}`,
		},
	);
	return minify(fullSize, {
		collapseWhitespace: true,
		maxLineLength: 700,
		collapseBooleanAttributes: true,
		minifyCSS: true,
		processConditionalComments: true,
		removeAttributeQuotes: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeOptionalTags: true,
		removeRedundantAttributes: true,
		removeTagWhitespace: true,
		useShortDoctype: true,
	});
};

export const render = (emailMarkup: React.ReactNode, extraStyles = '') => {
	return `<html lang="en">${inlineStylesWithMarkup(emailMarkup, extraStyles)}</html>`;
};

app.get('/email', (req, res, next) => {
	try {
		if (!hostIsValid(req, 'community') || process.env.NODE_ENV === 'production') {
			return next();
		}
		return res.send(render(Digest(communityData)));
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
