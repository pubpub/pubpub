import app from '../server';
import { submitDoiData } from '../utilities';

app.post('/api/doi', (req, res)=> {
	// Check to make sure they are a communityAdmin
	submitDoiData(req.body.pubId, req.body.communityId, true)
	.then((pubDoi)=> {
		return res.status(201).json(pubDoi);
	})
	.catch((err)=> {
		console.log('Error creating DOI', err);
		return res.status(500).json(err);
	});
});
