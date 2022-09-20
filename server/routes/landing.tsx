import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { getLandingPageFeatures } from 'server/landingPageFeature/queries';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

app.get('/', async (req, res, next) => {
	try {
		if (!hostIsValid(req, 'pubpub')) {
			return next();
		}
		const initialData = await getInitialData(req);
		const featuredItems = await getLandingPageFeatures();
		return renderToNodeStream(
			res,
			<Html
				chunkName="Landing"
				initialData={initialData}
				viewData={{ featuredItems }}
				headerComponents={generateMetaComponents({
					initialData,
					title: 'PubPub · Community Publishing',
					description:
						'The open-source, community-led, end-to-end publishing platform for knowledge communities.',
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
