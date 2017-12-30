import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Promise from 'bluebird';
import Landing from 'containers/Landing/Landing';
import Html from '../Html';
import app from '../server';
import { User } from '../models';
import { getInitialData } from '../utilities';

app.get('/', (req, res)=> {
	return Promise.all([getInitialData(req), User.findOne()])
	.then(([communityData, loginData])=> {
		const initialData = {
			loginData: loginData,
			communityData: communityData,
			isBasePubPub: false,
		};
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="Landing"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">Landing Test</title>,
				]}
			>
				<Landing {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});
