import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Promise from 'bluebird';
import Collection from 'containers/Collection/Collection';
import Html from '../Html';
import app from '../server';
import { User } from '../models';
import { getCommunity } from '../utilities';

app.get('/', (req, res)=> {
	return Promise.all([getCommunity(req), User.findOne()])
	.then(([communityData, loginData])=> {
		const initialData = {
			loginData: loginData,
			communityData: communityData,
			isBasePubPub: false,
		};
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="Collection"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">{communityData.title}</title>,
				]}
			>
				<Collection {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});
