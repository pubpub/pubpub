import React from 'react';
import Login from 'containers/Login/Login';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/login', (req, res, next)=> {
	analytics(req);
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="Login"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `Login · ${initialData.communityData.title}`,
					description: initialData.communityData.description,
				})}
			>
				<Login {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
