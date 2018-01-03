import app from '../server';
import { Collection, CommunityAdmin, CollectionPub } from '../models';

app.post('/api/collectionPubs', (req, res)=> {
	const user = req.user || {};

	CommunityAdmin.findOne({
		where: { userId: user.id, communityId: req.body.communityId },
		raw: true,
	})
	.then((communityAdminData)=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData) {
			throw new Error('Not Authorized to edit this pub');
		}
		return CollectionPub.create({
			collectionId: req.body.collectionId,
			pubId: req.body.pubId,
		});
	})
	.then((newCollectionPub)=> {
		return Collection.findOne({
			where: { id: newCollectionPub.collectionId },
			attributes: ['id', 'title', 'slug', 'isPublic'],
		});
	})
	.then((newCollectionPubData)=> {
		return res.status(201).json(newCollectionPubData);
	})
	.catch((err)=> {
		console.error('Error in postCollectionPubs: ', err);
		return res.status(500).json(err.message);
	});
});

app.delete('/api/collectionPubs', (req, res)=> {
	const user = req.user || {};

	CommunityAdmin.findOne({
		where: { userId: user.id, communityId: req.body.communityId },
		raw: true,
	})
	.then((communityAdminData)=> {
		if (user.id !== 'b242f616-7aaa-479c-8ee5-3933dcf70859' && !communityAdminData) {
			throw new Error('Not Authorized to edit this pub');
		}
		return CollectionPub.destroy({
			where: {
				collectionId: req.body.collectionId,
				pubId: req.body.pubId,	
			}
		});
	})
	.then(function(removedCount) {
		return res.status(201).json(req.body.collectionId);
	})
	.catch(function(err) {
		console.error('Error in putUser: ', err);
		return res.status(500).json(err.message);
	});
});
