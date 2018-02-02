import React from 'react';
import Promise from 'bluebird';
import CollectionSubmit from 'containers/CollectionSubmit/CollectionSubmit';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
// import { Collection, CommunityAdmin } from '../models';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findCollection } from '../queryHelpers';

app.get(['/:slug/submit', '/:slug/submit/:hash'], (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }
	analytics(req);

	return getInitialData(req)
	.then((initialData)=> {
		const collectionId = initialData.communityData.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && req.params.slug === undefined) { return curr.id; }
			if (curr.slug === req.params.slug) { return curr.id; }
			return prev;
		}, undefined);

		if (!collectionId) { throw new Error('Collection Not Found'); }

		return Promise.all([
			initialData,
			findCollection(collectionId, false, initialData)
		]);
	})
	.then(([initialData, collectionData])=> {
		const newInitialData = {
			...initialData,
			collectionData: collectionData,
		};
		return renderToNodeStream(res,
			<Html
				chunkName="CollectionSubmit"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `${collectionData.title} Submit`,
					description: `Create a new pub in ${collectionData.title}`,
				})}
			>
				<CollectionSubmit {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
