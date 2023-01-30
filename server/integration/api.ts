import app, { wrap } from 'server/server';

import { destroyIntegration } from './queries';

app.delete(
	'/api/integration',
	wrap(async (req, res) => {
		await destroyIntegration(req.body.id, req.user.id);
		return res.status(201).json(req.body.id);
	}),
);
