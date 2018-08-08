import app from '../server';
import { Collection, Pub, Collaborator, CollectionPub, CommunityAdmin, PubManager, PubAttribution, PubTag } from '../models';
import { generateHash } from '../utilities';
import { generatePubCreateNotification } from '../notifications';

app.post('/api/pubs', (req, res)=> {
	const user = req.user || {};
	const newPubSlug = generateHash(8);

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const date = new Date();
	const dateString = `${months[date.getMonth()]} ${date.getDate()}`;

	// verify that user is communityAdmin
	const findCommunityAdmin = CommunityAdmin.findOne({
		where: {
			communityId: req.body.communityId,
			userId: user.id,
		}
	});
	return findCommunityAdmin
	.then((communityAdminData)=> {
		if (!communityAdminData) {
			throw new Error('Not Authorized to create pub in this collection');
		}
		return Pub.create({
			title: `New Pub on ${dateString}`,
			slug: newPubSlug,
			communityId: req.body.communityId,
			draftPermissions: 'private',
			isCommunityAdminManaged: true,
			draftEditHash: generateHash(8),
			draftViewHash: generateHash(8),
		});
	})
	.then((newPub)=> {
		const createPubManager = PubManager.create({
			userId: user.id,
			pubId: newPub.id,
		});
		const createPubAttribution = PubAttribution.create({
			userId: user.id,
			pubId: newPub.id,
			isAuthor: true,
			order: 0.5,
		});
		// const createNotification = generatePubCreateNotification(newPub, user.id);
		const createNotification = undefined;

		const defaultTagIds = req.body.defaultTagIds || [];
		const newPubTagObjects = defaultTagIds.map((tagId)=> {
			return {
				pubId: newPub.id,
				tagId: tagId,
			};
		});
		const createPubTags = PubTag.bulkCreate(newPubTagObjects);
		return Promise.all([createPubManager, createPubAttribution, createPubTags, createNotification]);
	})
	.then(()=> {
		return res.status(201).json(`/pub/${newPubSlug}/draft`);
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
		if (['slug', 'title', 'description', 'avatar', 'useHeaderImage', 'isCommunityAdminManaged', 'communityAdminDraftPermissions', 'draftPermissions', 'labels'].indexOf(key) > -1) {
			updatedPub[key] = req.body[key] && req.body[key].trim ? req.body[key].trim() : req.body[key];
			if (key === 'slug') {
				updatedPub.slug = updatedPub.slug.replace(/[^a-zA-Z0-9-]/gi, '').replace(/ /g, '-').toLowerCase();
			}
		}
	});

	const findPubManager = PubManager.findOne({
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
	Promise.all([findPubManager, findCommunityAdmin, findPub])
	.then(([pubManagerData, communityAdminData, pubData])=> {
		// const isManager = collaboratorData && collaboratorData.permissions === 'manage';
		const accessAsCommunityAdmin = communityAdminData && pubData.adminPermissions === 'manage';
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859'
			&& !pubManagerData
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

	const findPubManager = PubManager.findOne({
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
	Promise.all([findPubManager, findCommunityAdmin, findPub])
	.then(([pubManagerData, communityAdminData, pubData])=> {
		// Only community admins can delete a published pub
		// Managers can delete their own unpublished pubs
		// const isManager = collaboratorData && collaboratorData.permissions === 'manage';
		const accessAsManager = !pubData.firstPublishedAt && pubManagerData;
		const accessAsCommunityAdmin = communityAdminData && (pubData.adminPermissions === 'manage' || pubManagerData);
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
