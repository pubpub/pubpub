import React from 'react';
import queryString from 'query-string';

import Html from 'server/Html';
import app from 'server/server';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
import { getCommunityOverview } from 'server/utils/queryHelpers';
import { addActivityItem, getActivityItems } from 'server/activityItem/queries';

app.get('/dash', (req, res) => {
	res.redirect(queryString.stringifyUrl({ url: '/dash/overview', query: req.query }));
});
type ActivityKind = 'community-created';
app.get('/dash/overview', async (req, res, next) => {
	try {
		if (!hostIsValid(req, 'community')) {
			next();
		}
		const initialData = await getInitialData(req, true);
		const overviewData = await getCommunityOverview(initialData);
		const {
			communityData: { id: communityId },
		} = initialData;
		const {
			loginData: { id: userId },
		} = initialData;
		const kind = 'community-created' as ActivityKind;
		const createMe = {
			payload: {
				community: { title: 'demo title' },
			},
			kind,
			communityId,
			actorId: userId || 'dummy holder',
		};
		const created = await addActivityItem(createMe);
		const items = await getActivityItems(userId);
		console.log('here: ', { items, created });
		return renderToNodeStream(
			res,
			<Html
				chunkName="DashboardCommunityOverview"
				initialData={initialData}
				viewData={{ overviewData }}
				headerComponents={generateMetaComponents({
					initialData,
					title: `Overview · ${initialData.communityData.title}`,
					unlisted: true,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
