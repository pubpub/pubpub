import React from 'react';
import NewPricing from 'containers/NewPricing/NewPricing';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/new/pricing', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		return renderToNodeStream(res,
			<Html
				chunkName="NewPricing"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'PubPub · Pricing',
				})}
			>
				<NewPricing {...initialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
