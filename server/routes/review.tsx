import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { hostIsValid } from 'server/utils/routes';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

app.get(['/pub/review/:slug'], async (req, res, next) => {
	try {
		if (!hostIsValid(req, 'community')) {
			return next();
		}
		const initialData = await getInitialData(req, true);
		return renderToNodeStream(
			res,
			<Html
				chunkName="Review"
				initialData={initialData}
				viewData={{ reviewDocument: 'b' }}
				headerComponents={generateMetaComponents({
					initialData,
					title: `Review · Did Whitebeard Survive???`,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next);
	}
});
