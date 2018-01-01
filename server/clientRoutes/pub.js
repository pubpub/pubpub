import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Promise from 'bluebird';
import PubPresentation from 'containers/PubPresentation/PubPresentation';
import Html from '../Html';
import app from '../server';
import { User, Collection, Pub, Collaborator, Discussion, Version, CommunityAdmin } from '../models';
import { getInitialData, handleErrors, generateMetaComponents } from '../utilities';

app.get('/pub/:slug', (req, res, next)=> {
	return getInitialData(req)
	.then((initialData)=> {

		const versionParameters = req.query.version
			? {
				where: { id: req.query.version },
			}
			: {
				limit: 1,
				order: [['createdAt', 'DESC']],
			};
		const findPub = Pub.findOne({
			where: {
				slug: req.params.slug.toLowerCase(),
				communityId: initialData.communityData.id,
			},
			include: [
				{
					model: User,
					as: 'collaborators',
					attributes: ['id', 'avatar', 'initials', 'fullName', 'slug'],
					through: { attributes: { exclude: ['updatedAt'] } },
				},
				{
					required: false,
					model: Collaborator,
					as: 'emptyCollaborators',
					where: { userId: null },
					attributes: { exclude: ['updatedAt'] },
				},
				{
					required: false,
					separate: true,
					model: Discussion,
					as: 'discussions',
					include: [{ model: User, as: 'author', attributes: ['id', 'fullName', 'avatar', 'slug', 'initials'] }],
				},
				{
					required: false,
					model: Collection,
					as: 'collections',
					attributes: ['id', 'title', 'slug', 'isPublic'],
					through: { attributes: [] },
				},
				{
					required: false,
					separate: true,
					model: Version,
					as: 'versions',
					...versionParameters
				}
			]
		});
		const findCommunityAdmin = CommunityAdmin.findOne({
			where: {
				userId: initialData.loginData.id,
				communityId: initialData.communityData.communityId,
			}
		});
		return Promise.all([initialData, findPub, findCommunityAdmin]);
	})
	.then(([initialData, pubData, communityAdminData])=> {
		if (!pubData) { throw new Error('Pub Not Found'); }

		const pubDataJson = pubData.toJSON();
		const userPermissions = pubDataJson.collaborators.reduce((prev, curr)=> {
			if (curr.id === initialData.loginData.id) { return curr.Collaborator.permissions; }
			return prev;
		}, 'none');
		const adminPermissions = communityAdminData ? pubDataJson.adminPermissions : 'none';
		const formattedPubData = {
			...pubDataJson,
			collaborators: [
				...pubDataJson.collaborators,
				...pubDataJson.emptyCollaborators.map((item)=> {
					return {
						id: item.id,
						initials: item.name[0],
						fullName: item.name,
						Collaborator: {
							id: item.id,
							isAuthor: item.isAuthor,
							permissions: item.permissions,
							order: item.order,
							createdAt: item.createdAt,
						}
					};
				})
			],
			discussions: pubDataJson.discussions.filter((item)=> {
				return item.isPublic || userPermissions !== 'none' || adminPermissions !== 'none';
			}).map((item)=> {
				if (adminPermissions === 'none' && item.submitHash) {
					return { ...item, submitHash: 'present' };
				}
				return item;
			}),
			collections: pubDataJson.collections.filter((item)=> {
				return item.isPublic || communityAdminData;
			}),
			// Add submit for publication button that creates discussion with submitHash
			// Need to add a map to remove the submitHash if not communityAdmin
			// Return threadNumber and pop them into that new submission (actually we should do that for all discussions)
			// on publication - check for discussion with submit hash and communityAdmin
			// on cancelling submission - perhaps we shoudl remove the archive button and replace it with a 'cancel submission'
			// discussion that are archived and have a submithash can't be un-archived, perhaps.

			emptyCollaborators: undefined,
		};
		formattedPubData.localPermissions = formattedPubData.collaborators.reduce((prev, curr)=> {
			if (curr.id === initialData.loginData.id) {
				const currPermissions = curr.Collaborator.permissions;
				if (prev === 'manage') { return prev; }
				if (currPermissions === 'manage') { return currPermissions; }
				if (currPermissions === 'edit' && prev !== 'manage') { return currPermissions; }
				if (currPermissions === 'view' && prev === 'none') { return currPermissions; }
			}
			return prev;
		}, adminPermissions);
		if (req.query.access === formattedPubData.viewHash && formattedPubData.localPermissions === 'none') {
			formattedPubData.localPermissions = 'view';
		}
		if (req.query.access === formattedPubData.editHash && (formattedPubData.localPermissions === 'none' || formattedPubData.localPermissions === 'view')) {
			formattedPubData.localPermissions = 'edit';
		}
		if (pubDataJson.collaborationMode === 'publicView' && formattedPubData.localPermissions === 'none') {
			formattedPubData.localPermissions = 'view';
		}
		if (pubDataJson.collaborationMode === 'publicEdit' && (formattedPubData.localPermissions === 'none' || formattedPubData.localPermissions === 'view')) {
			formattedPubData.localPermissions = 'edit';
		}
		if (initialData.loginData.id === 14) {
			formattedPubData.localPermissions = 'manage';
		}
		if (formattedPubData.localPermissions !== 'manage') {
			formattedPubData.viewHash = undefined;
			formattedPubData.editHash = undefined;
		}
		if (!formattedPubData.versions.length && formattedPubData.localPermissions === 'none') { throw new Error('Pub Not Found'); }

		const isUnlisted = formattedPubData.collections.reduce((prev, curr)=> {
			if (curr.isPublic) { return false; }
			return prev;
		}, true);


		const newInitialData = {
			...initialData,
			pubData: formattedPubData,
		};
		res.setHeader('content-type', 'text/html');
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="PubPresentation"
				initialData={newInitialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: pubData.title,
					description: pubData.description,
					image: pubData.avatar,
					publishedAt: pubData.firstPublishedAt,
					unlisted: isUnlisted,
				})}
			>
				<PubPresentation {...newInitialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch(handleErrors(req, res, next));
});
