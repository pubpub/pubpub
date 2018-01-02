import Promise from 'bluebird';
import { User, Collection, Pub, Collaborator, Discussion, CommunityAdmin, Community } from './models';

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
