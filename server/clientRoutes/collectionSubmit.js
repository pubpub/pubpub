import React from 'react';
import Promise from 'bluebird';
import CollectionSubmit from 'containers/CollectionSubmit/CollectionSubmit';
import Html from '../Html';
import app from '../server';
import { User, Collection, Pub, Collaborator, Discussion, CommunityAdmin } from '../models';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get(['/:slug/submit', '/:slug/submit/:hash'], (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {
		const collectionId = initialData.communityData.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && req.params.slug === undefined) { return curr.id; }
			if (curr.slug === req.params.slug) { return curr.id; }
			return prev;
		}, undefined);

		if (!collectionId) { throw new Error('Collection Not Found'); }

		const findCollection = Collection.findOne({
			where: {
				id: collectionId
			}
		});
		const findCommunityAdmin = CommunityAdmin.findOne({
			where: {
				userId: initialData.loginData.id,
				communityId: initialData.communityData.communityId,
			}
		});
		return Promise.all([initialData, findCollection, findCommunityAdmin]);
	})
	.then(([initialData, collectionData, communityAdminData])=> {
		const collectionDataJson = collectionData.toJSON();
		if (!communityAdminData && req.params.hash !== collectionDataJson.createPubHash) {
			collectionDataJson.createPubHash = undefined;
		}

		const newInitialData = {
			...initialData,
			collectionData: collectionDataJson,
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
