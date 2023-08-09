import type { Application } from 'express';
import { z, ZodString } from 'zod';
import { generateSchema } from '@anatine/zod-openapi';
import { OpenApiBuilder, InfoObject, OperationObject, PathItemObject } from 'openapi3-ts/oas31';
import { expressRetroSpective } from './express-retrospective';
import { validate } from './validation-middleware';

export interface OpenApiConfig {
	info: InfoObject;
}

function isValidationMiddleware(handler: Function): handler is ReturnType<typeof validate> {
	return (handler as any).isValidationMiddleware;
}

export function expressAppToApiSchema(config: OpenApiConfig, app: Application) {
	const expressRetroSpectiveResult = expressRetroSpective(app);
	const openApiSchema = new OpenApiBuilder({
		openapi: '3.0.0',
		info: config.info,
		servers: [
			{
				url: '/',
			},
		],
		components: {
			securitySchemes: {
				cookieAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'connect.sid',
				},
			},
		},
		paths: expressRetroSpectiveResult
			.filter(({ handlers }) => handlers.some(isValidationMiddleware))
			.map(({ path, handlers, method, params }) => {
				const validationMiddleware = handlers.find(isValidationMiddleware) as ReturnType<
					typeof validate
				>;
				const operationObject: OperationObject = {
					security: validationMiddleware.security,
					description: validationMiddleware.description,
					summary: validationMiddleware.summary,
					tags: validationMiddleware.tags,
					parameters: [
						...params.map(({ name, optional }) => ({
							name,
							in: 'path' as const,
							required: !optional,
							schema: generateSchema(z.string()),
						})),
						...(validationMiddleware.zodSchemas.query
							? Object.entries<ZodString>(
									validationMiddleware.zodSchemas.query.shape,
							  ).map(([paramName, paramZodShape]) => ({
									name: paramName,
									in: 'query' as const,
									description: paramZodShape.description,
									required: !paramZodShape.isOptional(),
									schema: generateSchema(paramZodShape),
							  }))
							: []),
					],
					...(validationMiddleware.zodSchemas.body
						? {
								requestBody: {
									required: true,
									content: {
										'application/json': {
											schema: generateSchema(
												validationMiddleware.zodSchemas.body,
											),
										},
									},
								},
						  }
						: {}),
					responses: {
						...(validationMiddleware.zodSchemas.response
							? {
									'200': {
										description: '',
										content: {
											'application/json': {
												schema: generateSchema(
													validationMiddleware.zodSchemas.response,
												),
												// {
												// 	target: 'openApi3',
												// },
												// ),
											},
										},
									},
							  }
							: {}),
						...Object.fromEntries(
							Object.entries(validationMiddleware.zodSchemas.statusCodes).map(
								([statusCode, zodObject]) => [
									statusCode,
									{
										description: '',
										content: {
											'application/json': {
												schema: generateSchema(zodObject),
											},
										},
									},
								],
							),
						),
					},
				};
				return [
					path,
					{
						[method]: operationObject,
					},
				] as const;
			})
			.reduce((acc, [path, methodObject]) => {
				acc[path] = { ...(acc[path] || {}), ...methodObject };

				return acc;
			}, {} as Record<string, PathItemObject>),
	});

	return openApiSchema.rootDoc;
}
