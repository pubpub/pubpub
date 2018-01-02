import React from 'react';
import Promise from 'bluebird';
import CollectionContainer from 'containers/Collection/Collection';
import Html from '../Html';
import app from '../server';
// import { User, Collection, Pub, Collaborator, Discussion, CommunityAdmin } from '../models';
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

		return Promise.all([initialData, findCollection(collectionId, true, initialData)]);
	// 	const findCollection = Collection.findOne({
	// 		where: {
	// 			id: collectionId
	// 		},
	// 		include: [
	// 			{
	// 				model: Pub,
	// 				as: 'pubs',
	// 				through: { attributes: [] },
	// 				attributes: {
	// 					exclude: ['editHash', 'viewHash'],
	// 				},
	// 				include: [
	// 					{
	// 						model: User,
	// 						as: 'collaborators',
	// 						attributes: ['id', 'avatar', 'initials'],
	// 						through: { attributes: ['isAuthor'] },
	// 					},
	// 					{
	// 						required: false,
	// 						model: Collaborator,
	// 						as: 'emptyCollaborators',
	// 						where: { userId: null },
	// 						attributes: { exclude: ['createdAt', 'updatedAt'] },
	// 					},
	// 					{
	// 						required: false,
	// 						separate: true,
	// 						model: Discussion,
	// 						as: 'discussions',
	// 						attributes: ['suggestions', 'pubId', 'submitHash', 'isArchived']
	// 					}
	// 				]
	// 			}
	// 		],
	// 	});
	// 	const findCommunityAdmin = CommunityAdmin.findOne({
	// 		where: {
	// 			userId: initialData.loginData.id,
	// 			communityId: initialData.communityData.communityId,
	// 		}
	// 	});
	// 	return Promise.all([initialData, findCollection, findCommunityAdmin]);
	})
	.then(([initialData, collectionData])=> {
	// 	const collectionDataJson = collectionData.toJSON();
	// 	collectionDataJson.pubs = collectionDataJson.pubs.map((pub)=> {
	// 		return {
	// 			...pub,
	// 			discussionCount: pub.discussions ? pub.discussions.length : 0,
	// 			suggestionCount: pub.discussions ? pub.discussions.reduce((prev, curr)=> {
	// 				if (curr.suggestions) { return prev + 1; }
	// 				return prev;
	// 			}, 0) : 0,
	// 			collaboratorCount: pub.collaborators.length + pub.emptyCollaborators.length,
	// 			hasOpenSubmission: pub.discussions ? pub.discussions.reduce((prev, curr)=> {
	// 				if (curr.submitHash && !curr.isArchived) { return true; }
	// 				return prev;
	// 			}, false) : false,
	// 			discussions: undefined,
	// 			collaborators: [
	// 				...pub.collaborators,
	// 				...pub.emptyCollaborators.map((item)=> {
	// 					return {
	// 						id: item.id,
	// 						initials: item.name ? item.name[0] : '',
	// 						fullName: item.name,
	// 						Collaborator: {
	// 							id: item.id,
	// 							isAuthor: item.isAuthor,
	// 							permissions: item.permissions,
	// 							order: item.order,
	// 						}
	// 					};
	// 				})
	// 			],
	// 			emptyCollaborators: undefined,
	// 		};
	// 	}).filter((item)=> {
	// 		const adminCanCollab = item.adminPermissions !== 'none' && !!communityAdminData;
	// 		const publicCanCollab = item.collaborationMode !== 'private';
	// 		return !!item.firstPublishedAt || publicCanCollab || adminCanCollab;
	// 	});

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
