import { wrap } from 'server/wrap';
import { Router } from 'express';
export const router = Router();

import { destroyIntegrationDataOAuth1 } from './queries';

router.delete(
	'/api/integrationDataOAuth1',
	wrap((req, res) =>
		destroyIntegrationDataOAuth1(req.body.id, req.user.id).then(() =>
			res.status(201).json(req.body.id),
		),
	),
);
