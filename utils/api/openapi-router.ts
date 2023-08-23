import { Request, Response, Router } from 'express';
import { expressAppToApiSchema, OpenApiConfig } from './express-retrospective-to-openapi-schema';

type OpenApiMiddlewareOptions = OpenApiConfig & {
	redoc?: boolean;
	jsonEndpointUrl?: string;
};

const openApiMiddlewareOptionsDefaults: Partial<OpenApiMiddlewareOptions> = {
	redoc: false,
	jsonEndpointUrl: '/spec.json',
};

export const openApiMiddleware = (options: OpenApiMiddlewareOptions) => {
	const optionsWithDefaults = {
		...openApiMiddlewareOptionsDefaults,
		...options,
	};

	let swaggerDoc: ReturnType<typeof expressAppToApiSchema>;
	const router = Router();

	const openApiJsonPath = optionsWithDefaults.jsonEndpointUrl as string;
	router.get(openApiJsonPath, (req, res) => {
		swaggerDoc = swaggerDoc || expressAppToApiSchema(optionsWithDefaults, req.app);
		res.json(swaggerDoc);
	});

	if (optionsWithDefaults.redoc) {
		router.get('/', (req: Request, res: Response) => {
			const path = req.baseUrl + req.path;
			res.type('.html');
			res.send(`
            <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Elements in HTML</title>
  
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
  </head>
  <body>
  <style>
  .sl-elements.sl-antialiased.sl-h-full.sl-text-base.sl-font-ui.sl-text-body {
    height: 100vh !important;
  }
  </style>

    <elements-api
      apiDescriptionUrl="${path}${openApiJsonPath}"
      router="hash"
	  tryItCredentialsPolicy="same-origin"
    />

  </body>
</html>`);
			// 	res.send(`
			//         <!DOCTYPE html>
			//         <html>
			//         <head>
			//             <title>Redoc</title>
			//             <!-- needed for adaptive design -->
			//             <meta charset="utf-8" />
			//             <meta name="viewport" content="width=device-width, initial-scale=1" />
			//             <link
			//             href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
			//             rel="stylesheet"
			//             />

			//             <!--
			//             Redoc doesn't change outer page styles
			//             -->
			//             <style>
			//             body {
			//                 margin: 0;
			//                 padding: 0;
			//             }
			//             </style>
			//         </head>
			//         <body>
			//             <!--
			//             Redoc element with link to your OpenAPI definition
			//             -->
			//             <redoc spec-url="${path}${openApiJsonPath}"></redoc>
			//             <!--
			//             Link to Redoc JavaScript on CDN for rendering standalone element
			//             -->
			//             <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
			//         </body>
			//         </html>
			// `);
		});
	}

	return router;
};
