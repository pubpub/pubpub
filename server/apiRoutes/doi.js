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
	const { pubId, communityId } = req.body;
	return setDoiData({
		communityId: communityId,
		pubId: pubId,
	})
		.then((json) => res.status(201).json(json))
		.catch((err) => {
			res.status(500).json(err);
		});
});
