import { RequestHandler, Request as ExpressRequest } from 'express';
import app, { wrap } from 'server/server';
import { contract } from './contract';
import { Contract, IndexOrUndefined } from './client';
import {
	InferShapeOrZodTypeIfNotUndefined,
	InferStatusCodes,
	StatusCodes,
	ZodRawShapeOrObjOrArray,
	validate,
} from './validation-middleware';

export const createRoute = <
	Route extends Extract<keyof Contract, `/api/${string}`>,
	Method extends Extract<keyof Contract[Route], 'POST' | 'GET' | 'PUT' | 'DELETE'>,
	Options extends NonNullable<Contract[Route][Method]>,
	ReqBody extends IndexOrUndefined<Options, 'body'> = IndexOrUndefined<Options, 'body'>,
	ResBody extends IndexOrUndefined<Options, 'response'> = IndexOrUndefined<Options, 'response'>,
	ReqQuery extends IndexOrUndefined<Options, 'query'> = IndexOrUndefined<Options, 'query'>,
	ResStatusCodes extends IndexOrUndefined<Options, 'statusCodes'> = IndexOrUndefined<
		Options,
		'statusCodes'
	>,
	ReqParams extends IndexOrUndefined<Options, 'params'> = IndexOrUndefined<Options, 'params'>,
>(
	route: Route,
	method: Method,
	handler: RequestHandler<
		undefined extends ReqParams
			? ExpressRequest['params']
			: InferShapeOrZodTypeIfNotUndefined<ReqParams>,
		| InferStatusCodes<ResStatusCodes>
		| (ResStatusCodes extends StatusCodes
				? ResBody extends ZodRawShapeOrObjOrArray
					? InferShapeOrZodTypeIfNotUndefined<ResBody>
					: never
				: InferShapeOrZodTypeIfNotUndefined<ResBody>),
		InferShapeOrZodTypeIfNotUndefined<ReqBody>,
		InferShapeOrZodTypeIfNotUndefined<ReqQuery>
	>,
	options: { wrap: boolean } = { wrap: true },
) => {
	return app[method.toLowerCase()](
		route,
		validate(contract[route][method]!),
		options.wrap ? wrap(handler) : handler,
	);
};
