import { RequestHandler, Request as ExpressRequest } from 'express';
import app, { wrap } from 'server/server';
import { Contract, IndexOrUndefined, router } from './router';
import {
	InferShapeOrZodTypeIfNotUndefined,
	InferStatusCodes,
	StatusCodes,
	ZodRawShapeOrObjOrArray,
	validate,
} from './validation-middleware';
export const createRoute = <
	//	Contract extends CustomRouter,
	Route extends Extract<keyof Contract, `/api/${string}`>,
	Method extends Extract<keyof Contract[Route], 'POST' | 'GET' | 'PUT' | 'DELETE'>, // Extract<keyof Router[Route], 'POST' | 'GET' | 'PUT' | 'DELETE'>,
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
	//	contract: Contract,
	route: Route,
	method: Method,
	// handler: ValidationOutput<Options>,
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
		validate(router[route][method]!),
		options.wrap ? wrap(handler) : handler,
	);
};
