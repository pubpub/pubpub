import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Promise from 'bluebird';
import NoMatch from 'containers/NoMatch/NoMatch';
import Html from '../Html';
import app from '../server';
import { User, Community, Collection } from '../models';
import { getInitialData } from '../utilities';

app.use((req, res)=> {
	res.status(404);

	return Promise.all([getInitialData(req), User.findOne()])
	.then(([communityData, loginData])=> {
		const initialData = {
			loginData: loginData,
			communityData: communityData,
			isBasePubPub: false,
		};
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="NoMatch"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">{`Not Found · ${communityData.title}`}</title>,
				]}
			>
				<NoMatch {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});
