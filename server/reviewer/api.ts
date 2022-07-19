import app, { wrap } from 'server/server';
import { createReviewer } from './queries';

app.post(
	'/api/reviewer',
	wrap(async (req, res) => {
		const { reviewId, name, permissions } = req.body;
		if (!permissions.view) {
			throw new Error('Not Authorized');
		}
		const newReviewer = await createReviewer({
			name,
			reviewId,
		});
		return res.status(201).json(newReviewer);
	}),
);
