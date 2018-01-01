import React from 'react';
import Promise from 'bluebird';
import CollectionContainer from 'containers/Collection/Collection';
import Html from '../Html';
import app from '../server';
import { User, Collection, Pub, Collaborator, Discussion } from '../models';
import { renderToNodeStream, getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get(['/', '/:slug'], (req, res, next)=> {
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
			},
			include: [
				{
					model: Pub,
					as: 'pubs',
					through: { attributes: [] },
					attributes: {
						exclude: ['editHash', 'viewHash'],
					},
					include: [
						{
							model: User,
							as: 'collaborators',
							attributes: ['id', 'avatar', 'initials'],
							through: { attributes: ['isAuthor'] },
						},
						{
							required: false,
							model: Collaborator,
							as: 'emptyCollaborators',
							where: { userId: null },
							attributes: { exclude: ['createdAt', 'updatedAt'] },
						},
						{
							required: false,
							separate: true,
							model: Discussion,
							as: 'discussions',
							attributes: ['suggestions', 'pubId', 'submitHash', 'isArchived']
						}
					]
				}
			],
		});
		return Promise.all([initialData, findCollection]);
	})
	.then(([initialData, collectionData])=> {
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
