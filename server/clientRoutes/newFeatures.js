import React from 'react';
import NewFeatures from 'containers/NewFeatures/NewFeatures';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/new/features', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="NewFeatures"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'PubPub · Features',
				})}
			>
				<NewFeatures {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
