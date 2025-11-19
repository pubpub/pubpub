import { Router } from 'express';
export const router = Router();

import { subscribeToMailchimp } from './queries';

router.post('/api/subscribe', (req, res) => {
	return subscribeToMailchimp(req.body)
		.then(() => {
			return res.status(200).json(true);
		})
		.catch((err) => {
			console.error('Error in postSubscribe: ', err);
			return res.status(500).json(err.message);
		});
});
