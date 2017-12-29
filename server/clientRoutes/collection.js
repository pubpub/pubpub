import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Promise from 'bluebird';
import CollectionContainer from 'containers/Collection/Collection';
import Html from '../Html';
import app from '../server';
import { User, Collection, Pub, Collaborator, Discussion } from '../models';
import { getCommunity } from '../utilities';

app.get('/', (req, res)=> {
	return Promise.all([getCommunity(req), User.findOne()])
	.then(([communityData, loginData])=> {
		const collectionId = communityData.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && req.params.slug === undefined) { return curr.id; }
			if (curr.slug === req.params.slug) { return curr.id; }
			return prev;
		}, undefined);
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
		return Promise.all([communityData, loginData, findCollection]);
	})
	.then(([communityData, loginData, collectionData])=> {
		const initialData = {
			loginData: loginData,
			communityData: communityData,
			collectionData: collectionData,
			isBasePubPub: false,
			slug: req.params.slug,
		};
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="Collection"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">{collectionData.title}</title>,
					<meta key="meta-desc" name="description" content={collectionData.description} />,
				]}
			>
				<CollectionContainer {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});
