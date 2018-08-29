import React from 'react';
import NewAbout from 'containers/NewAbout/NewAbout';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/new/about', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="NewAbout"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'PubPub · About',
				})}
			>
				<NewAbout {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
