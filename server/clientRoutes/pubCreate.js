import React from 'react';
import PubCreate from 'containers/PubCreate/PubCreate';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/pub/create', (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }

	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="PubCreate"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `Create New Pub · ${initialData.communityData.title}`,
				})}
			>
				<PubCreate {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
