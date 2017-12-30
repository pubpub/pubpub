import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Login from 'containers/Login/Login';
import Html from '../Html';
import app from '../server';
import { getInitialData } from '../utilities';

app.get('/login', (req, res)=> {
	console.time('initDataGet');
	return getInitialData(req)
	.then((initialData)=> {
		console.timeEnd('initDataGet');
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="Login"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">{`Login · ${initialData.communityData.title}`}</title>,
				]}
			>
				<Login {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});
