import Promise from 'bluebird';
import validator from 'validator';
import { User, Collection, Pub, Collaborator, Discussion, CommunityAdmin, Community, Version, PubManager, PubAttribution, VersionPermission } from './models';
import { generateCitationHTML } from './utilities';

export const findPub = (req, initialData, isDraft)=> {
	if (req.query.version && !validator.isUUID(req.query.version)) {
		throw new Error('Pub Not Found');
	}

	const versionParameters = req.query.version
		? {
			where: { id: req.query.version },
		}
		: {
			limit: 1,
			order: [['createdAt', 'DESC']],
		};
	const getPubData = Pub.findOne({
		where: {
			slug: req.params.slug.toLowerCase(),
			communityId: initialData.communityData.id,
		},
		include: [
			{
				model: PubManager,
				as: 'managers',
				include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'fullName', 'avatar', 'slug', 'initials', 'title'] }],
			},
			{
				model: PubAttribution,
				as: 'attributions',
				required: false,
				include: [{ model: User, as: 'user', required: false, attributes: ['id', 'firstName', 'lastName', 'fullName', 'avatar', 'slug', 'initials', 'title'] }],
			},
			{
				model: VersionPermission,
				as: 'versionPermissions',
				required: false,
				include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'fullName', 'avatar', 'slug', 'initials', 'title'] }],
			},
			// {
			// 	model: User,
			// 	as: 'collaborators',
			// 	attributes: ['id', 'avatar', 'initials', 'fullName', 'slug', 'title', 'firstName', 'lastName'],
			// 	through: { attributes: { exclude: ['updatedAt'] } },
			// },
			// {
			// 	required: false,
			// 	model: Collaborator,
			// 	as: 'emptyCollaborators',
			// 	where: { userId: null },
			// 	attributes: { exclude: ['updatedAt'] },
			// },
			{
				required: false,
				separate: true,
				model: Discussion,
				as: 'discussions',
				include: [{ model: User, as: 'author', attributes: ['id', 'fullName', 'avatar', 'slug', 'initials', 'title'] }],
			},
			{
				required: false,
				model: Collection,
				as: 'collections',
				attributes: ['id', 'title', 'slug', 'isPublic', 'isOpenPublish'],
				through: { attributes: [] },
			},
			{
				required: false,
				// separate: true,
				model: Version,
				as: 'versions',
				attributes: ['createdAt', 'id', 'description', 'isPublic', 'isCommunityAdminShared']
				// ...versionParameters
			},
			{
				required: false,
				separate: true,
				model: Version,
				as: 'activeVersion',
				...versionParameters
			}
		]
	});
	// const getVersionsList = 5;
	// const getActiveVersion = Version.findOne({
	// 	where: {
	// 		slug: req.params.slug.toLowerCase(),
	// 		communityId: initialData.communityData.id,
	// 	},
	// 	attributes: ['id'],
	// 	include: [{
	// 		required: false,
	// 		model: Version,
	// 		as: 'versions',
	// 		attributes: ['createdAt', 'id']
	// 	}]
	// });
	const getCommunityAdminData = CommunityAdmin.findOne({
		where: {
			userId: initialData.loginData.id,
			communityId: initialData.communityData.id,
		}
	});
	return Promise.all([getPubData, getCommunityAdminData])
	.then(([pubData, communityAdminData])=> {
		if (!pubData) { throw new Error('Pub Not Found'); }
		const pubDataJson = pubData.toJSON();
		const activeVersion = pubDataJson.activeVersion[0];
		const hasSections = !isDraft && activeVersion && Array.isArray(activeVersion.content);
		// const sectionIndex = initialData.locationData.params.sectionId;
		const sectionId = initialData.locationData.params.sectionId;
		const validSectionId = hasSections && activeVersion.content.reduce((prev, curr)=> {
			if (!sectionId) { return true; }
			if (sectionId === curr.id) { return true; }
			return prev;
		}, false);
		// const sectionOutOfRange = hasSections && sectionIndex > activeVersion.content.length || sectionIndex < 1;
		if (hasSections && !validSectionId) { throw new Error('Pub Not Found'); }

		// const userPermissions = pubDataJson.managers.reduce((prev, curr)=> {
		// 	if (curr.userId === initialData.loginData.id) { return 'manage'; }
		// 	return prev;
		// }, 'none');

		/* Remove the content from the sections other than the rendered */
		/* section to save bytes on the transfer */
		const formattedActiveVersionData = !hasSections
			? activeVersion
			: {
				...activeVersion,
				content: activeVersion.content.map((item, index)=> {
					if (!sectionId && index === 0) { return item; }
					if (item.id === sectionId) { return item; }
					return { title: item.title, id: item.id };
				})
			};

		const isCommunityAdminManager = communityAdminData && pubDataJson.isCommunityAdminManaged;
		const isCommunityAdminViewer = communityAdminData && pubDataJson.communityAdminDraftPermissions === 'view';
		const isCommunityAdminEditor = communityAdminData && pubDataJson.communityAdminDraftPermissions === 'edit';
		const isValidViewHash = isDraft
			? req.query.access === pubData.draftViewHash
			: req.query.access === activeVersion.viewHash;
		const isValidEditHash = isDraft && req.query.access === pubData.draftEditHash;
		const isPubPubAdmin = initialData.loginData.id === 14;

		const isManager = pubDataJson.managers.reduce((prev, curr)=> {
			if (curr.userId === initialData.loginData.id) { return true; }
			return prev;
		}, isCommunityAdminManager || isPubPubAdmin);
		const isDraftEditor = pubDataJson.versionPermissions.reduce((prev, curr)=> {
			if (curr.userId === initialData.loginData.id
				&& !curr.versionId
				&& curr.permissions === 'edit'
			) { return true; }
			return prev;
		}, isCommunityAdminEditor || isValidEditHash || pubDataJson.draftPermissions === 'publicEdit');
		const isDraftViewer = pubDataJson.versionPermissions.reduce((prev, curr)=> {
			if (curr.userId === initialData.loginData.id
				&& !curr.versionId
				&& curr.permissions === 'view'
			) { return true; }
			return prev;
		}, isCommunityAdminViewer || isValidViewHash || pubDataJson.draftPermissions === 'publicView');
		const isVersionViewer = pubDataJson.versionPermissions.reduce((prev, curr)=> {
			if (curr.userId === initialData.loginData.id
				&& curr.versionId === formattedActiveVersionData.id
				&& curr.permissions === 'edit'
			) { return true; }
			return prev;
		}, isManager || isValidViewHash || activeVersion.isPublic);

		/* Ensure draft access */
		if (isDraft && !isManager && !isDraftViewer && !isDraftEditor) {
			throw new Error('Pub Not Found');
		}

		/* Ensure saved version access */
		if (!isDraft && !isManager && !isVersionViewer) {
			throw new Error('Pub Not Found');
		}


		const formattedPubData = {
			...pubDataJson,
			// versions: formattedVersionsData,
			activeVersion: formattedActiveVersionData,
			// versionsList: versionsListData.toJSON().versions,
			attributions: pubDataJson.attributions.map((attribution)=> {
				if (attribution.user) { return attribution; }
				return {
					...attribution,
					user: {
						id: attribution.id,
						initials: attribution.name[0],
						fullName: attribution.name,
						firstName: attribution.name.split(' ')[0],
						lastName: attribution.name.split(' ').slice(1, attribution.name.split(' ').length).join(' '),
					}
				};
			}),
			// collaborators: [
			// 	...pubDataJson.collaborators,
			// 	...pubDataJson.emptyCollaborators.map((item)=> {
			// 		return {
			// 			id: item.id,
			// 			initials: item.name[0],
			// 			fullName: item.name,
			// 			firstName: item.name.split(' ')[0],
			// 			lastName: item.name.split(' ').slice(1, item.name.split(' ').length).join(' '),
			// 			Collaborator: {
			// 				id: item.id,
			// 				isAuthor: item.isAuthor,
			// 				isContributor: item.isContributor,
			// 				title: item.title,
			// 				roles: item.roles,
			// 				permissions: item.permissions,
			// 				order: item.order,
			// 				createdAt: item.createdAt,
			// 			}
			// 		};
			// 	})
			// ],
			discussions: pubDataJson.discussions.filter((item)=> {
				// return item.isPublic || userPermissions !== 'none' || adminPermissions !== 'none';
				return item.isPublic || isManager;
			}).map((item)=> {
				if (!isManager && item.submitHash) {
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
			// emptyCollaborators: undefined,
			isManager: isManager,
			isDraftEditor: isDraftEditor,
			isDraftViewer: isDraftViewer,
			isVersionViewer: isVersionViewer,
		};
		const citationData = generateCitationHTML(formattedPubData, initialData.communityData);
		formattedPubData.citationData = citationData;
		// formattedPubData.localPermissions = formattedPubData.collaborators.reduce((prev, curr)=> {
		// 	if (curr.id === initialData.loginData.id) {
		// 		const currPermissions = curr.Collaborator.permissions;
		// 		if (prev === 'manage') { return prev; }
		// 		if (currPermissions === 'manage') { return currPermissions; }
		// 		if (currPermissions === 'edit' && prev !== 'manage') { return currPermissions; }
		// 		if (currPermissions === 'view' && prev === 'none') { return currPermissions; }
		// 	}
		// 	return prev;
		// }, isManager ? 'manage' : 'none');
		// if (req.query.access === formattedPubData.viewHash && formattedPubData.localPermissions === 'none') {
		// 	formattedPubData.localPermissions = 'view';
		// }
		// if (req.query.access === formattedPubData.editHash && (formattedPubData.localPermissions === 'none' || formattedPubData.localPermissions === 'view')) {
		// 	formattedPubData.localPermissions = 'edit';
		// }
		// if (pubDataJson.collaborationMode === 'publicView' && formattedPubData.localPermissions === 'none') {
		// 	formattedPubData.localPermissions = 'view';
		// }
		// if (pubDataJson.collaborationMode === 'publicEdit' && (formattedPubData.localPermissions === 'none' || formattedPubData.localPermissions === 'view')) {
		// 	formattedPubData.localPermissions = 'edit';
		// }
		// if (initialData.loginData.id === 14) {
		// 	formattedPubData.localPermissions = 'manage';
		// }
		if (!isManager) {
			formattedPubData.draftViewHash = undefined;
			formattedPubData.draftEditHash = undefined;
		}
		// if (!formattedPubData.versions.length && formattedPubData.localPermissions === 'none') { throw new Error('Pub Not Found'); }
		return formattedPubData;
	});
};

export const findCollection = (collectionId, useIncludes, initialData)=> {
	const includes = useIncludes
		? [
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
						attributes: ['id', 'avatar', 'initials', 'fullName'],
						through: { attributes: ['isAuthor', 'isContributor', 'order'] },
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
		]
		: [];
	const collectionQuery = Collection.findOne({
		where: {
			id: collectionId
		},
		include: includes,
	});
	const communityAdminQuery = CommunityAdmin.findOne({
		where: {
			userId: initialData.loginData.id,
			communityId: initialData.communityData.id,
		}
	});
	return Promise.all([collectionQuery, communityAdminQuery])
	.then(([collectionData, communityAdminData])=> {
		const collectionDataJson = collectionData.toJSON();
		if (collectionData.pubs) {
			collectionDataJson.pubs = collectionDataJson.pubs.map((pub)=> {
				return {
					...pub,
					discussionCount: pub.discussions ? pub.discussions.length : 0,
					suggestionCount: pub.discussions ? pub.discussions.reduce((prev, curr)=> {
						if (curr.suggestions) { return prev + 1; }
						return prev;
					}, 0) : 0,
					collaboratorCount: pub.collaborators.length + pub.emptyCollaborators.length,
					hasOpenSubmission: pub.discussions ? pub.discussions.reduce((prev, curr)=> {
						if (curr.submitHash && !curr.isArchived) { return true; }
						return prev;
					}, false) : false,
					discussions: undefined,
					collaborators: [
						...pub.collaborators,
						...pub.emptyCollaborators.map((item)=> {
							return {
								id: item.id,
								initials: item.name ? item.name[0] : '',
								fullName: item.name,
								Collaborator: {
									id: item.id,
									isAuthor: item.isAuthor,
									permissions: item.permissions,
									order: item.order,
								}
							};
						})
					],
					emptyCollaborators: undefined,
				};
			}).filter((item)=> {
				const adminCanCollab = item.adminPermissions !== 'none' && !!communityAdminData;
				const publicCanCollab = item.collaborationMode !== 'private';
				return !!item.firstPublishedAt || publicCanCollab || adminCanCollab;
			});
		}
		if (!communityAdminData && initialData.locationData.params.hash !== collectionDataJson.createPubHash) {
			collectionDataJson.createPubHash = undefined;
		}
		return collectionDataJson;
	});
};

export const getPubSearch = (query, initialData)=> {
	const searchTerms = [
		{
			$or: [
				{ title: { $ilike: `%${query.q}%` } },
				{ description: { $ilike: `%${query.q}%` } },
			]
		},
		{
			$or: [
				{ firstPublishedAt: { $ne: null } },
				{ collaborationMode: 'publicView' },
				{ collaborationMode: 'publicEdit' },
			]
		}
	];

	const includes = [
		{
			model: Collection,
			as: 'collections',
			where: { isPublic: true },
			attributes: ['id', 'isPublic'],
			through: { attributes: [] },
		},
		{
			model: User,
			as: 'collaborators',
			attributes: ['id', 'avatar', 'initials', 'fullName'],
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
			attributes: ['suggestions', 'pubId']
		},
	];
	if (initialData.communityData.id) {
		searchTerms.push({ communityId: initialData.communityData.id });
	}
	if (!initialData.communityData.id) {
		includes.push({
			model: Community,
			as: 'community',
			attributes: ['id', 'subdomain', 'domain', 'title', 'smallHeaderLogo', 'accentColor'],
		});
	}

	return Pub.findAll({
		where: {
			$and: searchTerms
		},
		attributes: {
			exclude: ['editHash', 'viewHash'],
		},
		limit: 10,
		include: includes
	})
	.then((results)=> {
		const output = results.map((pubObject)=> {
			const pub = pubObject.toJSON();
			return {
				...pub,
				discussionCount: pub.discussions ? pub.discussions.length : 0,
				suggestionCount: pub.discussions ? pub.discussions.reduce((prev, curr)=> {
					if (curr.suggestions) { return prev + 1; }
					return prev;
				}, 0) : 0,
				collaboratorCount: pub.collaborators.length + pub.emptyCollaborators.length,
				discussions: undefined,
				collaborators: [
					...pub.collaborators,
					...pub.emptyCollaborators.map((item)=> {
						return {
							id: item.id,
							initials: item.name[0],
							fullName: item.name,
							Collaborator: {
								id: item.id,
								isAuthor: item.isAuthor,
								permissions: item.permissions,
								order: item.order,
							}
						};
					})
				],
				emptyCollaborators: undefined,
			};
		});
		return output;
	});
};
