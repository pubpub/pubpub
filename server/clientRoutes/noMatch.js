import ReactDOMServer from 'react-dom/server';
import React from 'react';
import NoMatch from 'containers/NoMatch/NoMatch';
import Html from '../Html';
import app from '../server';
import { getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/*', (req, res, next)=> {
	res.status(404);

	return getInitialData(req)
	.then((initialData)=> {
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="NoMatch"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `Not Found · ${initialData.communityData.title}`,
				})}
			>
				<NoMatch {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch(handleErrors(req, res, next));
});
