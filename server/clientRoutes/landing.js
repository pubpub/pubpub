import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Landing from 'containers/Landing/Landing';
import Html from '../Html';
import app from '../server';
import { getCommunity } from '../utilities';

app.get('/', (req, res)=> {
	return getCommunity(req)
	.then((community)=> {
		const initialData = { community: community };
		return ReactDOMServer.renderToStaticNodeStream(
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
