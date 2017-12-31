import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Login from 'containers/Login/Login';
import Html from '../Html';
import app from '../server';
import { getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/login', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return ReactDOMServer.renderToNodeStream(
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
		)
		.pipe(res);
	})
	.catch(handleErrors(req, res, next));
});
