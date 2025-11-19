import React from 'react';

import Html from 'server/Html';
import { Router } from 'express';
export const router = Router();
import { NotFoundError, handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';
// import { getDiscussions } from 'server/utils/queryHelpers';

router.get(
	[
		'/dash/discussions',
		'/dash/collection/:collectionSlug/discussions',
		'/dash/pub/:pubSlug/discussions',
	],
	async (req, res, next) => {
		try {
			if (!hostIsValid(req, 'community')) {
				return next();
			}
			const initialData = await getInitialData(req, { isDashboard: true });
			if (!initialData.scopeData.elements.activeTarget) {
				throw new NotFoundError();
			}
			// const discussionsData = await getDiscussions(initialData);
			const discussionsData = {};
			return renderToNodeStream(
				res,
				<Html
					chunkName="DashboardDiscussions"
					initialData={initialData}
					viewData={{ discussionsData }}
					headerComponents={generateMetaComponents({
						initialData,
						title: `Discussions · ${initialData.scopeData.elements.activeTarget.title}`,
						unlisted: true,
					})}
				/>,
			);
		} catch (err) {
			return handleErrors(req, res, next)(err);
		}
	},
);
