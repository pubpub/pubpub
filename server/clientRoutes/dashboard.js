import React from 'react';
import Promise from 'bluebird';
import Dashboard from 'containers/Dashboard/Dashboard';
import Html from '../Html';
import app from '../server';
import analytics from '../analytics';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findCollection } from '../queryHelpers';

app.get(['/dashboard', '/dashboard/:slug', '/dashboard/:slug/:mode'], (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }
	analytics(req);

	return getInitialData(req)
	.then((initialData)=> {
		if (!initialData.loginData.isAdmin) { throw new Error('User Not Admin'); }

		const slug = initialData.locationData.params.slug || '';
		const activeItem = {};
		if (slug === 'activity') { activeItem.title = 'Activity'; }
		if (slug === 'team') { activeItem.title = 'Team'; }
		if (slug === 'site') { activeItem.title = 'Site'; }
		if (slug === 'page') { activeItem.title = 'New Page'; }
		if (slug === 'collection') { activeItem.title = 'New Collection'; }

		const collectionId = initialData.communityData.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && (req.params.slug === undefined || req.params.slug === 'home')) { return curr.id; }
			if (curr.slug === req.params.slug) { return curr.id; }
			return prev;
		}, undefined);

		if (!collectionId && !activeItem.title) { throw new Error('Collection Not Found'); }

		const findCollectionData = activeItem.title
			? activeItem
			: findCollection(collectionId, true, initialData);

		return Promise.all([
			initialData,
			findCollectionData,
		]);
	})
	.then(([initialData, collectionData])=> {
		const newInitialData = {
			...initialData,
			collectionData: collectionData,
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Dashboard"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `${collectionData.title} · Dashboard`,
					unlisted: true,
				})}
			>
				<Dashboard {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
