import app from 'server/server';

import { createUserScopeVisit } from './queries';

app.post('/api/userScopeVisit', (req, res) => {
	return createUserScopeVisit(req.body, req.hostname)
		.then(() => {
			return res.status(201).json(true);
		})
		.catch((err) => {
			console.error('Error in postUserScopeVisit: ', err);
			return res.status(500).json(err.message);
		});
});
