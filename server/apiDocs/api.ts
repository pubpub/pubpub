import app from 'server/server';
import { openApiMiddleware } from 'utils/api';
import swaggerUi from 'swagger-ui-express';
import 'swagger-ui-dist';
import { expressAppToApiSchema } from 'utils/api/express-retrospective-to-openapi-schema';

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

let swaggerDoc = {} as ReturnType<typeof expressAppToApiSchema>;
// ashtasht

app.use(
	'/api-docs',
	swaggerUi.serveWithOptions({
		redirect: false,
	}),
	(req, res, next) => {
		console.log('AAAAAAAAA');
		const doc = expressAppToApiSchema(
			{
				info: {
					title: 'hi',
					version: '1.0.0',
				},
			},
			req.app,
		);
		swaggerDoc = swaggerDoc || doc;

		next();
	},
	swaggerUi.setup(swaggerDoc),
);
