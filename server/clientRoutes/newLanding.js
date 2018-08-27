import React from 'react';
import NewLanding from 'containers/NewLanding/NewLanding';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/landing', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="NewLanding"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'PubPub',
				})}
			>
				<NewLanding {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
