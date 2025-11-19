import { Router } from 'express';
export const router = Router();
import { openApiMiddleware } from 'utils/api/openapi-router';

router.use(
	'/apidocs',
	openApiMiddleware({
		info: {
			title: 'PubPub API',
			version: '6.0.0',
		},
	}),
);
