import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

app.get('/community-services', (req, res, next) => {
	if (!hostIsValid(req, 'pubpub')) {
		return next();
	}

	return getInitialData(req)
		.then((initialData) => {
			return renderToNodeStream(
				res,
				<Html
					chunkName="CommunityServices"
					initialData={initialData}
					headerComponents={generateMetaComponents({
						initialData,
						title: 'Community Services · PubPub',
					})}
				/>,
			);
		})
		.catch(handleErrors(req, res, next));
});
