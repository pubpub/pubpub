import React from 'react';
import app from 'server/server';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import juice from 'juice';
import { handleErrors } from 'server/utils/errors';

import { hostIsValid } from 'server/utils/routes';
import { getInitialData } from 'server/utils/initData';
import { minify } from 'html-minifier';
import util from 'util';
import flatten from 'lodash.flatten';

import { Digest } from 'components/Email';
import { reset, globals } from 'components/Email/styles';
import { renderActivityItem } from 'client/utils/activity';
import { getResizedUrl } from 'utils/images';
import { ActivityRenderContext } from 'client/utils/activity/types';
import { fetchActivityItems } from 'server/activityItem/fetch';
import { communityUrl } from 'utils/canonicalUrls';

import { createActivityAssociations } from '../../utils/activity';

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

app.get('/email', async (req, res, next) => {
	try {
		const initialData = await getInitialData(req, true);
		const {
			communityData: {
				headerLogo,
				title: communityTitle,
				accentColorDark = '#2D3752',
				accentColorLight = '#FFFFFF',
			},
			scopeData: { scope },
			loginData: { id: userId },
		} = initialData;
		if (!hostIsValid(req, 'community') || process.env.NODE_ENV === 'production' || !userId) {
			return next();
		}
		const activityData = await fetchActivityItems({ scope });
		const { activityItems } = activityData;
		const associations = createActivityAssociations();
		const activityRenderContext: ActivityRenderContext = {
			associations,
			userId,
			scope,
		};
		const resizedHeaderLogo = getResizedUrl(headerLogo || '', 'inside', undefined, 50);
		const pubActivityItems = activityItems.filter(
			({ pubId, collectionId, payload }) => pubId || collectionId || 'page' in payload,
		);
		const test = {
			pub: { title: 'S-CRY-ed' },
			target: {
				pub: {
					id: '606c5ee7-d74e-4190-8861-eb5a2094c2d7',
					slug: 'cktyq7pk',
					title: 'Ergo Proxy',
				},
			},
		};

		const flattenKeys = (obj) =>
			typeof obj && obj === 'object' && !Array.isArray(obj)
				? [
						...Object.keys(obj),
						...flatten(Object.entries(obj).map(([, value]) => flattenKeys(value))),
				  ]
				: [];

		const groupedByObjectId = activityItems.reduce((result, item) => {
			const { pubId, collectionId, payload } = item;
			const objectId = pubId || collectionId || ('page' in payload && payload.page.id);
			console.log({ payload });
			const displayKey = flattenKeys(payload)
				.sort()
				.join();
			console.log({ displayKey });
			return objectId
				? { ...result, [objectId]: [...(result[objectId] || []), { ...item, displayKey }] }
				: result;
		}, {});
		const communityActivityItems = activityItems.filter(
			({ pubId, collectionId, payload }) => !pubId && !collectionId && !('page' in payload),
		);
		const renderedPubItems = pubActivityItems.map((item) =>
			renderActivityItem(item, activityRenderContext),
		);
		const renderedCommunityItems = communityActivityItems.map((item) =>
			renderActivityItem(item, activityRenderContext),
		);
		const sortedGroupedActivityItems = Object.keys(groupedByObjectId).map((objectId) => {
			// console.log(util.inspect(groupedByObjectId[objectId], false, null, true));
			const sorted = groupedByObjectId[objectId].sort((first, second) =>
				first.timestamp > second.timestamp ? -1 : 1,
			);
			// console.log(util.inspect(sorted, false, null, true));
			const returnable = sorted.reduce(
				(result, item) => (item.kind in result ? result : { ...result, [item.kind]: item }),
				{},
			);
			return returnable;
		});
		// console.log(util.inspect(sortedGroupedActivityItems, false, null, true));
		if (!sortedGroupedActivityItems) console.log('never');
		return res.send(
			render(
				Digest({
					communityUrl: communityUrl(initialData.communityData),
					communityTitle,
					headerLogo: resizedHeaderLogo,
					accentColorLight,
					accentColorDark,
					pubItems: renderedPubItems,
					communityItems: renderedCommunityItems,
				}),
			),
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
