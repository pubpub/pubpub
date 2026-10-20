import React from 'react';

import { Router } from 'express';

import { getActiveTemplatesForOrg } from 'server/communityTemplate/queries';
import Html from 'server/Html';
import {
	getHubCommunities,
	getOrgBySlug,
	getOrgWithCommunities,
	isUserOrgMember,
} from 'server/org/queries';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

export const router = Router();

router.get('/community/create', (req, res, next) => {
	if (!hostIsValid(req, 'pubpub')) {
		return next();
	}

	const orgSlug = req.query.org as string | undefined;

	return Promise.all([
		getInitialData(req),
		orgSlug ? getOrgBySlug(orgSlug) : Promise.resolve(null),
	])
		.then(async ([initialData, orgData]) => {
			const templates = orgData ? await getActiveTemplatesForOrg(orgData.id) : [];

			// Fetch org communities for the clone-from-community picker
			let hubCommunities: {
				id: string;
				title: string;
				subdomain: string;
				avatar?: string;
			}[] = [];
			if (orgData && orgData.communityCloneAccess !== 'off') {
				const userId = initialData.loginData?.id;
				const isSuperAdmin = initialData.loginData?.isSuperAdmin;
				const isManager = userId ? await isUserOrgMember(userId, orgData.id) : false;

				// 'managers' mode: only load communities for managers/superadmins
				// 'everyone' mode: load for all users
				const canSeeClone =
					orgData.communityCloneAccess === 'everyone' || isSuperAdmin || isManager;

				if (canSeeClone) {
					if (isSuperAdmin || isManager) {
						// Managers/superadmins see all org communities
						const allCommunities = await getHubCommunities(orgData.id);
						hubCommunities = allCommunities.map((c: any) => ({
							id: c.id,
							title: c.title,
							subdomain: c.subdomain,
							avatar: c.headerLogo || c.heroLogo || null,
						}));
					} else {
						// Regular users see only landing-page-visible communities
						const orgWithCommunities = await getOrgWithCommunities(orgSlug!);
						if (orgWithCommunities?.communities) {
							hubCommunities = orgWithCommunities.communities.map((c: any) => ({
								id: c.id,
								title: c.title,
								subdomain: c.subdomain,
								avatar: c.headerLogo || c.heroLogo || null,
							}));
						}
					}
				}
			}

			const title = orgData
				? `Create Community · ${orgData.title}`
				: 'Create New Community · PubPub';
			return renderToNodeStream(
				res,
				<Html
					chunkName="CommunityCreate"
					initialData={initialData}
					viewData={{ orgData, templates, hubCommunities }}
					headerComponents={generateMetaComponents({
						initialData,
						title,
					})}
				/>,
			);
		})
		.catch(handleErrors(req, res, next));
});
