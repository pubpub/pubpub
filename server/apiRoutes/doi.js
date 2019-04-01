import app from '../server';
import { getDoiData, setDoiData } from './handlers/doi';

// TODO(ian): add some kind of authentication here
app.get('/api/doi', (req, res) => {
	const { pubId, collectionId, communityId } = req.query;
	getDoiData({ communityId: communityId, collectionId: collectionId, pubId: pubId })
		.then((submission) => res.status(201).json(submission.json))
		.catch((err) => {
			res.status(500).json(err);
		});
});

app.post('/api/doi', (req, res) => {
	const { pubId, collectionId, communityId } = req.body;
	return setDoiData({
		communityId: communityId,
		collectionId: collectionId,
		pubId: pubId,
	})
		.then((json) => res.status(201).json(json))
		.catch((err) => {
			res.status(500).json(err);
		});
	// .then(() => {
	// 	/* After issuing DOI, we need to recalculate citationData to send down */
	// 	return getInitialData(req);
	// })
	// .then((initialData) => {
	// 	const pseudoReq = {
	// 		query: { version: req.body.versionId },
	// 		params: { slug: req.body.slug },
	// 	};
	// 	return findPub(pseudoReq, initialData);
	// })
	// .then((pubData) => {
	// 	return res.status(201).json({
	// 		doi: pubData.doi,
	// 		citationData: pubData.citationData,
	// 	});
	// })
	// .catch((err) => {
	// 	console.error('Error creating DOI', err);
	// 	return res.status(500).json(err);
	// });
});
