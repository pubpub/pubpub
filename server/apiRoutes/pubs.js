import app from '../server';
import { Collection, Pub, Collaborator, CollectionPub, CommunityAdmin } from '../models';
import { generateHash } from '../utilities';
import { generatePubCreateNotification } from '../notifications';

app.post('/api/pubs', (req, res)=> {
	const user = req.user || {};
	const newPubSlug = generateHash(8);

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const date = new Date();
	const dateString = `${months[date.getMonth()]} ${date.getDate()}`;

	// verify that user is communityAdmin - or collection is open - or user has hash
	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	const findCollection = Collection.findOne({
		where: {
			id: req.body.collectionId,
			$or: [
				{ isOpenSubmissions: true },
				{ createPubHash: req.body.createPubHash }
			]
		}
	});

	return Promise.all([findCommunityAdmin, findCollection])
	.then(([communityAdminData, collectionData])=> {
		if (!communityAdminData && !collectionData) {
			throw new Error('Not Authorized to create pub in this collection');
		}
		return Pub.create({
			title: `New Pub on ${dateString}`,
			slug: newPubSlug,
			communityId: req.body.communityId,
			collaborationMode: 'private',
			adminPermissions: 'none',
			editHash: generateHash(8),
			viewHash: generateHash(8),
		});
	})
	.then((newPub)=> {
		const createCollaborator = Collaborator.create({
			userId: user.id,
			pubId: newPub.id,
			isAuthor: true,
			permissions: 'manage',
			order: 0.5,
		});
		const createNotification = generatePubCreateNotification(newPub, user.id);
		return Promise.all([createCollaborator, createNotification]);
	})
	.then(([newCollaborator])=> {
		return CollectionPub.create({
			collectionId: req.body.collectionId,
			pubId: newCollaborator.pubId,
		});
	})
	.then(()=> {
		return res.status(201).json(`/pub/${newPubSlug}/collaborate`);
	})
	.catch((err)=> {
		console.log('Error creating Pub', err);
		return res.status(500).json(err);
	});
});

app.put('/api/pubs', (req, res)=> {
	const user = req.user || {};

	// Filter to only allow certain fields to be updated
	const updatedPub = {};
	Object.keys(req.body).forEach((key)=> {
		if (['slug', 'title', 'description', 'avatar', 'useHeaderImage', 'collaborationMode', 'adminPermissions', 'labels'].indexOf(key) > -1) {
			updatedPub[key] = req.body[key] && req.body[key].trim ? req.body[key].trim() : req.body[key];
			if (key === 'slug') {
				updatedPub.slug = updatedPub.slug.replace(/[^a-zA-Z0-9-]/gi, '').replace(/ /g, '-').toLowerCase();
			}
		}
	});

	const findCollaborator = Collaborator.findOne({
		where: {
			userId: user.id,
			pubId: req.body.pubId,
		}
	});

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			userId: req.user && req.user.id,
			communityId: req.body.communityId || null,
		}
	});
	const findPub = Pub.findOne({
		where: { id: req.body.pubId, communityId: req.body.communityId }
	});
	Promise.all([findCollaborator, findCommunityAdmin, findPub])
	.then(([collaboratorData, communityAdminData, pubData])=> {
		const isManager = collaboratorData && collaboratorData.permissions === 'manage';
		const accessAsCommunityAdmin = communityAdminData && pubData.adminPermissions === 'manage';
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859'
			&& !isManager
			&& !accessAsCommunityAdmin
		) {
			throw new Error('Not Authorized to update this pub');
		}
		return Pub.update(updatedPub, {
			where: { id: req.body.pubId, communityId: req.body.communityId }
		});
	})
	.then(()=> {
		return res.status(201).json(updatedPub);
	})
	.catch((err)=> {
		console.log('Error putting Pub', req.body, err);
		return res.status(500).json(err);
	});
});

app.delete('/api/pubs', (req, res)=> {
	const user = req.user || {};

	const findCollaborator = Collaborator.findOne({
		where: {
			userId: user.id,
			pubId: req.body.pubId,
		}
	});

	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			userId: req.user && req.user.id,
			communityId: req.body.communityId || null,
		}
	});
	const findPub = Pub.findOne({
		where: { id: req.body.pubId, communityId: req.body.communityId }
	});
	Promise.all([findCollaborator, findCommunityAdmin, findPub])
	.then(([collaboratorData, communityAdminData, pubData])=> {
		// Only community admins can delete a published pub
		// Managers can delete their own unpublished pubs
		const isManager = collaboratorData && collaboratorData.permissions === 'manage';
		const accessAsManager = !pubData.firstPublishedAt && isManager;
		const accessAsCommunityAdmin = communityAdminData && isManager;
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859'
			&& !accessAsManager
			&& !accessAsCommunityAdmin
		) {
			throw new Error('Not Authorized to update this pub');
		}
		return Pub.destroy({
			where: { id: req.body.pubId, communityId: req.body.communityId }
		});
	})
	.then(()=> {
		return res.status(201).json(req.body.pubId);
	})
	.catch((err)=> {
		console.log('Error putting Pub', err);
		return res.status(500).json(err);
	});
});
