import app from 'server/server';
import { openApiMiddleware } from 'utils/api';

app.use(
	'/apidocs',
	openApiMiddleware({
		info: {
			title: 'hi',
			version: '1.0.0',
		},
		redoc: true,
	}),
);
