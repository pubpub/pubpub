import app, { wrap } from 'server/server';

import { destroyZoteroIntegration } from './queries';

app.delete(
	'/api/zoteroIntegrations',
	wrap(async (req, res) => {
		console.log('got the request, anyway');
		await destroyZoteroIntegration(req.body.id, req.user.id);
		return res.status(201).json(req.body.id);
	}),
);
