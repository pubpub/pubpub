import React from 'react';

import { Router } from 'express';

import Html from 'server/Html';
import { HubCommunity, HubOptOut } from 'server/models';
import { getOrgsForCommunity } from 'server/org/queries';
import { getOrgsForPub } from 'server/orgFeaturedPub/queries';
import { handleErrors, NotFoundError } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

export const router = Router();

router.get('/dash/curatedby', async (req, res, next) => {
	try {
		if (!hostIsValid(req, 'community')) {
			return next();
		}
		const initialData = await getInitialData(req, { isDashboard: true });
		if (!initialData.scopeData.elements.activeTarget) {
			throw new NotFoundError();
		}
		if (!initialData.scopeData.activePermissions.canManage) {
			throw new NotFoundError();
		}

		const { activePub } = initialData.scopeData.elements;
		const communityId = initialData.communityData.id;

		let curatingOrgs;
		let scopeType: 'community' | 'pub';

		if (activePub) {
			// Pub-scope: load orgs curating this specific pub
			scopeType = 'pub';
			curatingOrgs = await getOrgsForPub(activePub.id);
		} else {
			// Community-scope: load orgs curating this community
			scopeType = 'community';
			const [orgs, optOuts, hubCommunities] = await Promise.all([
				getOrgsForCommunity(communityId),
				HubOptOut.findAll({
					where: { communityId },
					attributes: ['orgId'],
				}),
				HubCommunity.findAll({
					where: { communityId },
					attributes: ['orgId', 'dataAccess'],
				}),
			]);
			const rejectedOrgIds = new Set(optOuts.map((o) => (o as any).orgId));
			const dataAccessMap = new Map(
				hubCommunities.map((hc) => [(hc as any).orgId, (hc as any).dataAccess]),
			);
			curatingOrgs = orgs.map((org: any) => ({
				...org,
				rejected: rejectedOrgIds.has(org.id),
				dataAccess: dataAccessMap.get(org.id) || 'none',
			}));
		}

		const scopeTitle = activePub ? activePub.title : initialData.communityData.title;

		return renderToNodeStream(
			res,
			<Html
				chunkName="DashboardCuratedBy"
				initialData={initialData}
				viewData={{ curatingOrgs, scopeType }}
				headerComponents={generateMetaComponents({
					initialData,
					title: `Curated By · ${scopeTitle}`,
					unlisted: true,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
