import app from '../server';
import { Collaborator, User, CommunityAdmin } from '../models';
import { generateNewCollaboratorNotification } from '../notifications';

app.post('/api/collaborators', (req, res)=> {
	// Authenticate user. Make sure they have edit permissions on the given pub.
	// Add a single collaborator
	// Add a new collaborator

	const user = req.user || {};

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findCollaborator = Collaborator.findOne({
		where: { pubId: req.body.pubId, userId: user.id },
		raw: true,
	});
	Promise.all([findCommunityAdmin, findCollaborator])
	.then(([communityAdminData, collaboratorData])=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData && (!collaboratorData || collaboratorData.permissions !== 'manage')) {
			throw new Error('Not Authorized to edit this pub');
		}
		return Collaborator.create({
			userId: req.body.userId,
			pubId: req.body.pubId,
			isAuthor: false,
			isContributor: false,
			name: req.body.name,
			permissions: 'none',
			order: req.body.order,
		});
	})
	.then((newCollaborator)=> {
		const findNewCollaborator = Collaborator.findOne({
			where: { id: newCollaborator.id },
			attributes: { exclude: ['updatedAt'] },
			include: [
				{ model: User, as: 'user', attributes: ['id', 'slug', 'initials', 'fullName', 'avatar'] }
			]
		});
		const generateNotification = generateNewCollaboratorNotification(newCollaborator.pubId, req.body.communityId, req.body.userId);
		return Promise.all([findNewCollaborator, generateNotification]);
	})
	.then(([newCollaboratorData])=> {
		const collaboratorUser = newCollaboratorData.user || {};
		const output = {
			id: collaboratorUser.id || newCollaboratorData.id,
			fullName: collaboratorUser.fullName || newCollaboratorData.name,
			initials: collaboratorUser.initials || newCollaboratorData.name[0],
			slug: collaboratorUser.slug,
			avatar: collaboratorUser.avatar,
			Collaborator: {
				id: newCollaboratorData.id,
				isAuthor: newCollaboratorData.isAuthor,
				permissions: newCollaboratorData.permissions,
				order: newCollaboratorData.order,
				createdAt: newCollaboratorData.createdAt,
			}
		};
		return res.status(201).json(output);
	})
	.catch((err)=> {
		console.error('Error in postCollaborators: ', err);
		return res.status(500).json(err.message);
	});
});

app.put('/api/collaborators', (req, res)=> {
	const user = req.user || {};

	// Filter to only allow certain fields to be updated
	const updatedCollaborator = {};
	Object.keys(req.body).forEach((key)=> {
		if (['permissions', 'isAuthor', 'isContributor', 'name', 'order', 'roles'].indexOf(key) > -1) {
			updatedCollaborator[key] = req.body[key];
		}
	});

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findCollaborator = Collaborator.findOne({
		where: { pubId: req.body.pubId, userId: user.id },
		raw: true,
	});
	Promise.all([findCommunityAdmin, findCollaborator])
	.then(([communityAdminData, collaboratorData])=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData && (!collaboratorData || collaboratorData.permissions !== 'manage')) {
			throw new Error('Not Authorized to edit this pub');
		}
		return Collaborator.update(updatedCollaborator, {
			where: { id: req.body.collaboratorId },
		});
	})
	.then(()=> {
		return res.status(201).json({
			fullName: req.body.name,
			Collaborator: {
				id: req.body.collaboratorId,
				...updatedCollaborator,
			},
		});
	})
	.catch((err)=> {
		console.error('Error in putUser: ', err);
		return res.status(500).json(err.message);
	});
});

app.delete('/api/collaborators', (req, res)=> {
	const user = req.user || {};

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findCollaborator = Collaborator.findOne({
		where: { pubId: req.body.pubId, userId: user.id },
		raw: true,
	});
	Promise.all([findCommunityAdmin, findCollaborator])
	.then(([communityAdminData, collaboratorData])=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData && (!collaboratorData || collaboratorData.permissions !== 'manage')) {
			throw new Error('Not Authorized to edit this pub');
		}
		return Collaborator.destroy({
			where: { id: req.body.collaboratorId },
		});
	})
	.then(()=> {
		return res.status(201).json(req.body.collaboratorId);
	})
	.catch((err)=> {
		console.error('Error in deleteCollaborator: ', err);
		return res.status(500).json(err.message);
	});
});
