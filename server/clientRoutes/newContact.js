import React from 'react';
import NewContact from 'containers/NewContact/NewContact';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/new/contact', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="NewContact"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'PubPub · Contact',
				})}
			>
				<NewContact {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
