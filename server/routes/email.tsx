import React from 'react';
import app from 'server/server';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import juice from 'juice';
import { handleErrors } from 'server/utils/errors';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import { GroupedActivityItems } from 'client/components/Email/Digest';

import { hostIsValid } from 'server/utils/routes';
import { getInitialData } from 'server/utils/initData';
import { minify } from 'html-minifier';

import { Digest } from 'components/Email';
import { reset, globals } from 'components/Email/styles';
import { ActivityItem } from 'types/activity';
import { fetchActivityItems } from 'server/activityItem/fetch';

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
			communityData: { id: communityId },
			scopeData: { scope },
			loginData: { id: userId },
		} = initialData;
		if (!hostIsValid(req, 'community') || process.env.NODE_ENV === 'production' || !userId) {
			return next();
		}
		const { activityItems, associations } = await fetchActivityItems({ scope });
		const getAffectedObjectIcon = (item: ActivityItem) =>
			item.pubId
				? 'pubDoc'
				: item.collectionId
				? 'collection'
				: 'page' in item.payload && item.payload.page.id
				? 'page-layout'
				: 'office';

		const getAffectedObject = (item: ActivityItem) =>
			item.pubId
				? associations.pub[item.pubId]
				: item.collectionId
				? associations.collection[item.collectionId]
				: 'page' in item.payload && item.payload.page.id
				? associations.page[item.payload.page.id]
				: associations.community[item.communityId];

		const activityItemsGroupedByObjectId: Record<
			string,
			KeyedActivityItem[]
		> = activityItems.reduce((result, item) => {
			const objectId = getAffectedObject(item).id;
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
				[objectId]: {
					items: activityItemsGroupedByObjectId[objectId]
						.sort((first, second) => (first.timestamp > second.timestamp ? -1 : 1))
						.reduce(
							(result, item) =>
								item.displayKey in result
									? result
									: { ...result, [item.displayKey]: item },
							{},
						),
					title: getAffectedObject(activityItemsGroupedByObjectId[objectId][0]).title,
					icon: getAffectedObjectIcon(activityItemsGroupedByObjectId[objectId][0]),
				},
			}),
			{},
		);

		const communityItems: GroupedActivityItems = pick(dedupedActivityItems, communityId);
		const pubItems: GroupedActivityItems = omit(dedupedActivityItems, communityId);
		return res.send(
			render(
				Digest({
					userId, // replace this with email recipient's userId
					community: initialData.communityData,
					associations,
					pubItems,
					communityItems,
				}),
			),
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
