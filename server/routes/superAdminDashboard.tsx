import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { ForbiddenError, handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
import { getLandingPageFeatures } from 'server/landingPageFeature/queries';

app.get('/superadmin', async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		if (!initialData.scopeData.activePermissions.isSuperAdmin) {
			throw new ForbiddenError();
		}
		const landingPageFeatures = await getLandingPageFeatures();
		return renderToNodeStream(
			res,
			<Html
				chunkName="SuperAdminDashboard"
				initialData={initialData}
				viewData={{ landingPageFeatures }}
				headerComponents={generateMetaComponents({
					initialData,
					title: 'SuperAdmin · PubPub',
					description: "Well aren't you special",
					unlisted: true,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
