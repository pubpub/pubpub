import React from 'react';

import Html from 'server/Html';
import { Router } from 'express';
export const router = Router();
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

router.get('/community/create', (req, res, next) => {
	if (!hostIsValid(req, 'pubpub')) {
		return next();
	}

	return getInitialData(req)
		.then((initialData) => {
			return renderToNodeStream(
				res,
				<Html
					chunkName="CommunityCreate"
					initialData={initialData}
					headerComponents={generateMetaComponents({
						initialData,
						title: 'Create New Community · PubPub',
					})}
				/>,
			);
		})
		.catch(handleErrors(req, res, next));
});
