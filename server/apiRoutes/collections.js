import app from '../server';
import { Collection } from '../models';
import withCommunityAdmin from './helpers/withCommunityAdmin';

app.post(
	'/api/collections',
	withCommunityAdmin((req, res) => {
		return Collection.create({
			title: req.body.title.trim(),
			isRestricted: true,
			isPublic: true,
			communityId: req.body.communityId,
			kind: req.body.kind,
		})
			.then((newCollection) => {
				return res.status(201).json(newCollection);
			})
			.catch((err) => {
				console.error('Error in postCollection: ', err);
				return res.status(500).json(err.message);
			});
	}),
);

app.put(
	'/api/collections',
	withCommunityAdmin((req, res) => {
		// Filter to only allow certain fields to be updated
		const updatedCollection = {};
		Object.keys(req.body).forEach((key) => {
			if (['title', 'isRestricted', 'isPublic', 'pageId'].indexOf(key) > -1) {
				updatedCollection[key] = req.body[key];
			}
		});

		return Collection.update(updatedCollection, {
			where: { id: req.body.collectionId },
		})
			.then(() => {
				return res.status(201).json(updatedCollection);
			})
			.catch((err) => {
				console.error('Error in putCollection: ', err);
				return res.status(500).json(err.message);
			});
	}),
);

app.delete(
	'/api/collections',
	withCommunityAdmin((req, res) => {
		return Collection.destroy({
			where: { id: req.body.collectionId },
		})
			.then(() => {
				return res.status(201).json(req.body.collectionId);
			})
			.catch((err) => {
				console.error('Error in deleteCollection: ', err);
				return res.status(500).json(err.message);
			});
	}),
);
