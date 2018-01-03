import React from 'react';
import Promise from 'bluebird';
import PubCollaboration from 'containers/PubCollaboration/PubCollaboration';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findPub } from '../queryHelpers';

app.get('/pub/:slug/collaborate', (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }

	return getInitialData(req)
	.then((initialData)=> {
		return Promise.all([
			initialData,
			findPub(req, initialData)
		]);
	})
	.then(([initialData, pubData])=> {
		const newInitialData = {
			...initialData,
			pubData: pubData,
		};
		return renderToNodeStream(res,
			<Html
				chunkName="PubCollaboration"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `Collaborate · ${pubData.title}`,
					description: pubData.description,
					image: pubData.avatar,
					publishedAt: pubData.firstPublishedAt,
					unlisted: true,
				})}
			>
				<PubCollaboration {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
