import React from 'react';
import app from 'server/server';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import juice from 'juice';
import { handleErrors } from 'server/utils/errors';
import pickBy from 'lodash.pickby';
import { GroupedActivityItems } from 'client/components/Email/Digest';

import { hostIsValid } from 'server/utils/routes';
import { getInitialData } from 'server/utils/initData';
import { minify } from 'html-minifier';

import { Digest } from 'components/Email';
import { reset, globals } from 'components/Email/styles';
import { renderActivityItem } from 'client/utils/activity';
import { getResizedUrl } from 'utils/images';
import { ActivityRenderContext } from 'client/utils/activity/types';
import { ActivityItem } from 'types/activity';
import { fetchActivityItems } from 'server/activityItem/fetch';
import { communityUrl } from 'utils/canonicalUrls';

import { createActivityAssociations } from '../../utils/activity';

type KeyedActivityItem = ActivityItem & {
	displayKey: string;
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

app.get('/email', async (req, res, next) => {
	try {
		const initialData = await getInitialData(req, true);
		const {
			communityData: {
				id: communityId,
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
		const resizedHeaderLogo = getResizedUrl(headerLogo || '', 'inside', undefined, 50);
		const { activityItems } = await fetchActivityItems({ scope });
		const activityRenderContext: ActivityRenderContext = {
			associations: createActivityAssociations(),
			userId,
			scope,
		};
		const renderActivityItemInContext = (item: ActivityItem) =>
			renderActivityItem(item, activityRenderContext);
		const getAffectedObjectId = (item: ActivityItem) =>
			item.pubId ||
			item.collectionId ||
			('page' in item.payload && item.payload.page.id) ||
			item.communityId;

		const activityItemsGroupedByObjectId: Record<
			string,
			KeyedActivityItem[]
		> = activityItems.reduce((result, item) => {
			const objectId = getAffectedObjectId(item);
			const payloadKeys = Object.keys(item.payload)
				.sort()
				.join();
			const displayKey = `${item.kind} - ${payloadKeys}`;
			return {
				...result,
				[objectId]: [...(result[objectId] || []), { ...item, displayKey }],
			};
		}, {});
		const dedupedActivityItems = Object.keys(activityItemsGroupedByObjectId).reduce(
			(memo, objectId) => ({
				...memo,
				[objectId]: activityItemsGroupedByObjectId[objectId]
					.sort((first, second) => (first.timestamp > second.timestamp ? -1 : 1))
					.reduce(
						(result, item) =>
							item.displayKey in result
								? result
								: { ...result, [item.displayKey]: item },
						{},
					),
			}),
			{},
		);

		const pubItems: GroupedActivityItems = pickBy(
			dedupedActivityItems,
			(_item: ActivityItem, affectedObjectId: string) => affectedObjectId !== communityId,
		);
		const communityItems: GroupedActivityItems = pickBy(
			dedupedActivityItems,
			(_item: ActivityItem, affectedObjectId: string) => affectedObjectId === communityId,
		);
		return res.send(
			render(
				Digest({
					communityUrl: communityUrl(initialData.communityData),
					communityTitle,
					headerLogo: resizedHeaderLogo,
					accentColorLight,
					accentColorDark,
					renderActivityItem: renderActivityItemInContext,
					pubItems,
					communityItems,
				}),
			),
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
