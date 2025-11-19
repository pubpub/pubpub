import { Router } from 'express';
export const router = Router();

import { DuplicateEmailError, createSignup } from './queries';

router.post('/api/signup', (req, res) => {
	return createSignup(req.body, req.hostname)
		.then(() => {
			return res.status(201).json(true);
		})
		.catch((err) => {
			if (err instanceof DuplicateEmailError) {
				return res.status(409).json(err.message);
			}
			console.error('Error in postSignup: ', err);
			return res.status(500).json(err.message);
		});
});
