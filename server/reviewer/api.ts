import app, { wrap } from 'server/server';
import { createReviewer } from './queries';

app.post(
	'/api/reviewer',
	wrap(async (req, res) => {
		const { id, name, permissions } = req.body;
		if (!permissions.canView) {
			throw new Error('Not Authorized');
		}
		const newReviewer = await createReviewer({
			name,
			id,
		});
		return res.status(201).json(newReviewer);
	}),
);
