import type { OpenAPIV3 } from 'openapi-types';
import type { Application } from 'express';
import zodToJsonSchema from 'zod-to-json-schema';
import { z, ZodString } from 'zod';
import { expressRetroSpective } from './express-retrospective';
import { validate } from './validation-middleware';

export interface OpenApiConfig {
	info: OpenAPIV3.Document['info'];
}

function isValidationMiddleware(handler: Function): handler is ReturnType<typeof validate> {
	return (handler as any).isValidationMiddleware;
}

export function expressAppToApiSchema(config: OpenApiConfig, app: Application): OpenAPIV3.Document {
	const expressRetroSpectiveResult = expressRetroSpective(app);
	return {
		openapi: '3.0.0',
		info: config.info,
		servers: [
			{
				url: '/',
			},
		],
		paths: Object.fromEntries(
			expressRetroSpectiveResult
				.filter(({ handlers }) => handlers.some(isValidationMiddleware))
				.map(({ path, handlers, method, params }) => {
					const validationMiddleware = handlers.find(
						isValidationMiddleware,
					) as ReturnType<typeof validate>;
					const operationObject: OpenAPIV3.OperationObject = {
						description: validationMiddleware.description,
						summary: validationMiddleware.summary,
						tags: validationMiddleware.tags,
						parameters: [
							...params.map(({ name, optional }) => ({
								name,
								in: 'path',
								required: !optional,
								schema: zodToJsonSchema(z.string(), {
									target: 'openApi3',
								}),
							})),
							...(validationMiddleware.zodSchemas.query
								? Object.entries<ZodString>(
										validationMiddleware.zodSchemas.query.shape,
								  ).map(([paramName, paramZodShape]) => ({
										name: paramName,
										in: 'query',
										description: paramZodShape.description,
										required: !paramZodShape.isOptional(),
										schema: zodToJsonSchema(paramZodShape, {
											target: 'openApi3',
										}),
								  }))
								: []),
						],
						...(validationMiddleware.zodSchemas.body
							? {
									requestBody: {
										required: true,
										content: {
											'application/json': {
												schema: zodToJsonSchema(
													validationMiddleware.zodSchemas.body,
													{
														target: 'openApi3',
													},
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
													schema: zodToJsonSchema(
														validationMiddleware.zodSchemas.response,
														{
															target: 'openApi3',
														},
													),
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
													schema: zodToJsonSchema(zodObject, {
														target: 'openApi3',
													}),
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
					];
				}),
		),
	};
}
