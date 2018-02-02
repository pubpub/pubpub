import app from '../server';

app.post('/api/doi', (req, res)=> {
	return res.status(201).json('Got it');
	// .catch((err)=> {
	// 	console.log('Error creating DOI', err);
	// 	return res.status(500).json(err);
	// });
});
