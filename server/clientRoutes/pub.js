import React from 'react';
import Promise from 'bluebird';
import Pub from 'containers/Pub/Pub';
import Html from '../Html';
import app from '../server';
import { hostIsValid, renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';
import { findPub } from '../queryHelpers';

app.get(['/newpub/:slug', '/newpub/:slug/:mode', '/newpub/:slug/content/:chapterId', '/newpub/:slug/:mode/:subMode'], (req, res, next)=> {
	if (!hostIsValid(req, 'community')) { return next(); }

	const acceptedModes = ['collaborators', 'versions', 'invite', 'discussions', 'contents'];
	if (req.params.mode && acceptedModes.indexOf(req.params.mode) === -1) { return next(); }

	return getInitialData(req)
	.then((initialData)=> {
		return Promise.all([initialData, findPub(req, initialData)]);
	})
	.then(([initialData, pubData])=> {
		const isUnlisted = pubData.collections.reduce((prev, curr)=> {
			if (curr.isPublic) { return false; }
			return prev;
		}, true);

		const newInitialData = {
			...initialData,
			pubData: pubData,
		};
		return renderToNodeStream(res,
			<Html
				chunkName="Pub"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: pubData.title,
					description: pubData.description,
					image: pubData.avatar,
					collaborators: pubData.collaborators,
					publishedAt: pubData.firstPublishedAt,
					doi: pubData.doi,
					unlisted: isUnlisted,
				})}
			>
				<Pub {...newInitialData} />
			</Html>
		);
	})
	.catch(handleErrors(req, res, next));
});
