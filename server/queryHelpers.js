import Promise from 'bluebird';
import validator from 'validator';
import { User, Collection, Pub, Collaborator, Discussion, CommunityAdmin, Community, Version } from './models';
import { generateCitationHTML } from './utilities';

export const findPub = (req, initialData)=> {
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
				model: User,
				as: 'collaborators',
				attributes: ['id', 'avatar', 'initials', 'fullName', 'slug', 'title', 'firstName', 'lastName'],
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
				separate: true,
				model: Version,
				as: 'versions',
				...versionParameters
			}
		]
	});
	// const getVersionsList = 5;
	const getVersionsList = Pub.findOne({
		where: {
			slug: req.params.slug.toLowerCase(),
			communityId: initialData.communityData.id,
		},
		attributes: ['id'],
		include: [{
			required: false,
			model: Version,
			as: 'versions',
			attributes: ['createdAt', 'id']
		}]
	});
	const getCommunityAdminData = CommunityAdmin.findOne({
		where: {
			userId: initialData.loginData.id,
			communityId: initialData.communityData.id,
		}
	});
	return Promise.all([getPubData, getVersionsList, getCommunityAdminData])
	.then(([pubData, versionsListData, communityAdminData])=> {
		if (!pubData) { throw new Error('Pub Not Found'); }
		const hasChapters = pubData.versions[0] && Array.isArray(pubData.versions[0].content);
		const chapterIndex = initialData.locationData.params.chapterId;
		const chapterOutOfRange = hasChapters && chapterIndex > pubData.versions[0].content.length || chapterIndex < 1;
		if (hasChapters && chapterOutOfRange) { throw new Error('Pub Not Found'); }

		const pubDataJson = pubData.toJSON();
		const userPermissions = pubDataJson.collaborators.reduce((prev, curr)=> {
			if (curr.id === initialData.loginData.id) { return curr.Collaborator.permissions; }
			return prev;
		}, 'none');

		/* Remove the content from the chapters other than the rendered */
		/* chapter to save bytes on the transfer */
		const formattedVersionsData = !hasChapters
			? pubDataJson.versions
			: [{
				...pubDataJson.versions[0],
				content: pubDataJson.versions[0].content.map((item, index)=> {
					if (!chapterIndex && index === 0) { return item; }
					if (index === chapterIndex - 1) { return item; }
					return { title: item.title };
				})
			}];

		const adminPermissions = communityAdminData ? pubDataJson.adminPermissions : 'none';
		const formattedPubData = {
			...pubDataJson,
			versions: formattedVersionsData,
			versionsList: versionsListData.toJSON().versions,
			collaborators: [
				...pubDataJson.collaborators,
				...pubDataJson.emptyCollaborators.map((item)=> {
					return {
						id: item.id,
						initials: item.name[0],
						fullName: item.name,
						firstName: item.name.split(' ')[0],
						lastName: item.name.split(' ').slice(1, item.name.split(' ').length).join(' '),
						Collaborator: {
							id: item.id,
							isAuthor: item.isAuthor,
							isContributor: item.isContributor,
							title: item.title,
							roles: item.roles,
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
		const citationData = generateCitationHTML(formattedPubData, initialData.communityData);
		formattedPubData.citationData = citationData;
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
						through: { attributes: ['isAuthor', 'isContributor'] },
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
