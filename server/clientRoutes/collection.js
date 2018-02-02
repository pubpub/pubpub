import React from 'react';
import Promise from 'bluebird';
import CollectionContainer from 'containers/Collection/Collection';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findCollection } from '../queryHelpers';

app.get(['/', '/:slug'], (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }

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
			findCollection(collectionId, true, initialData)
		]);
	})
	.then(([initialData, collectionData])=> {
		analytics(req);
		const newInitialData = {
			...initialData,
			collectionData: collectionData,
		};
		const pageTitle = collectionData.title === 'Home'
			? newInitialData.communityData.title
			: collectionData.title;
		return renderToNodeStream(res,
			<Html
				chunkName="Collection"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: pageTitle,
					description: collectionData.description,
				})}
			>
				<CollectionContainer {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
