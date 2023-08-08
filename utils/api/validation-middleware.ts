import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { z, ZodArray, ZodError, ZodObject, ZodRawShape, ZodString, ZodType } from 'zod';

type ValidationMiddlewareProperties = {
	isValidationMiddleware: boolean;
	summary?: string;
	description?: string;
	tags?: string[];
	zodSchemas: {
		body?: ZodObject<any>;
		query?: ZodObject<any>;
		response?: ZodObject<any>;
		statusCodes: Record<string, ZodObject<any>>;
	};
};

type ZodRawShapeOrObjOrArray = ZodRawShape | ZodObject<any> | ZodArray<any>;

type ZodifyRawShapeOrZodType<T extends ZodType | ZodRawShape> = T extends ZodType
	? T
	: T extends ZodRawShape
	? ZodObject<T>
	: never;
type InferZodRawShapeOrZodType<T extends ZodType | ZodRawShape> = T extends ZodType | ZodRawShape
	? z.infer<ZodifyRawShapeOrZodType<T>>
	: never;

type ZodStringRecordShape = { [k: string]: ZodString | ZodType<string | undefined> };

type StatusCodes = Record<string, ZodRawShapeOrObjOrArray>;

type ZodifiedStatusCodes<Type extends StatusCodes> = {
	[Property in keyof Type]: ZodifyRawShapeOrZodType<Type[Property]>;
};

type InferShapeOrZodTypeIfNotUndefined<T> = T extends ZodRawShapeOrObjOrArray
	? InferZodRawShapeOrZodType<T>
	: unknown;

type InferStatusCodes<T> = T extends StatusCodes ? z.infer<ZodifiedStatusCodes<T>[keyof T]> : never;

type Options<
	ReqBody extends ZodRawShapeOrObjOrArray | undefined,
	ResBody extends ZodRawShapeOrObjOrArray | undefined,
	ReqQuery extends ZodStringRecordShape | undefined,
	ResStatusCodes extends StatusCodes | undefined,
> = {
	body?: ReqBody;
	response?: ResBody;
	query?: ReqQuery;
	statusCodes?: ResStatusCodes | undefined;
	errorHandler?: (err: ZodError, req: Request, res: Response, next: NextFunction) => void;
	// TODO: rename to parseQuery
	queryThrowsError?: boolean;
	// TODO: rename to parseBody
	bodyThrowsError?: boolean;
	summary?: string;
	description?: string;
	tags?: string[];
};

type ValidationMiddleware = <
	ReqBody extends ZodRawShapeOrObjOrArray | undefined = undefined,
	ResBody extends ZodRawShapeOrObjOrArray | undefined = undefined,
	ReqQuery extends ZodStringRecordShape | undefined = undefined,
	ResStatusCodes extends StatusCodes | undefined = undefined,
>(
	options: Options<ReqBody, ResBody, ReqQuery, ResStatusCodes>,
) => RequestHandler<
	Request['params'],
	| InferStatusCodes<ResStatusCodes>
	| (ResStatusCodes extends StatusCodes
			? ResBody extends ZodRawShapeOrObjOrArray
				? InferShapeOrZodTypeIfNotUndefined<ResBody>
				: never
			: InferShapeOrZodTypeIfNotUndefined<ResBody>),
	InferShapeOrZodTypeIfNotUndefined<ReqBody>,
	InferShapeOrZodTypeIfNotUndefined<ReqQuery>
> &
	ValidationMiddlewareProperties;

export const defaultErrorHandler: Options<any, any, any, any>['errorHandler'] = (err, req, res) => {
	res.status(400).json(err);
};

function isZodObject(
	zodRawShapeOrZodType: ZodRawShapeOrObjOrArray,
): zodRawShapeOrZodType is ZodObject<any> {
	return zodRawShapeOrZodType instanceof ZodType;
}

function turnToZodObject(zodRawShapeOrZodType: ZodRawShapeOrObjOrArray): ZodObject<any> {
	if (isZodObject(zodRawShapeOrZodType)) {
		return zodRawShapeOrZodType;
	}
	return z.object(zodRawShapeOrZodType as ZodRawShape);
}

export const validate: ValidationMiddleware = (options) => {
	const optionsWithDefaults: Partial<typeof options> = {
		statusCodes: {} as any,
		errorHandler: defaultErrorHandler,
		queryThrowsError: true,
		bodyThrowsError: true,
		...options,
	};

	const zodBodySchema: ZodObject<any> | undefined =
		optionsWithDefaults.body && optionsWithDefaults.bodyThrowsError
			? turnToZodObject(optionsWithDefaults.body)
			: undefined;
	const zodQuerySchema: ZodObject<any> | undefined =
		optionsWithDefaults.query && optionsWithDefaults.queryThrowsError
			? z.object(optionsWithDefaults.query)
			: undefined;
	const zodResponseSchema: ZodObject<any> | undefined = optionsWithDefaults.response
		? turnToZodObject(optionsWithDefaults.response)
		: undefined;

	const zodSchema = z.object({
		...(optionsWithDefaults.body && optionsWithDefaults.bodyThrowsError
			? {
					body: zodBodySchema,
			  }
			: {}),
		...(optionsWithDefaults.query && optionsWithDefaults.queryThrowsError
			? {
					query: zodQuerySchema,
			  }
			: {}),
	});

	const handler: RequestHandler<any, any, any, any> & ValidationMiddlewareProperties = (
		req,
		res,
		next,
	) => {
		const { query, body } = req;
		const shouldParseSchema =
			(optionsWithDefaults.body && optionsWithDefaults.bodyThrowsError) ||
			(optionsWithDefaults.query && optionsWithDefaults.queryThrowsError);
		if (shouldParseSchema) {
			const parseResult = zodSchema.safeParse({
				...(optionsWithDefaults.body && optionsWithDefaults.bodyThrowsError
					? {
							body,
					  }
					: {}),
				...(optionsWithDefaults.query && optionsWithDefaults.queryThrowsError
					? {
							query,
					  }
					: {}),
			});
			if (!parseResult.success) {
				optionsWithDefaults.errorHandler!(parseResult.error, req, res, next);
				return;
			}

			req.body = parseResult.data.body || req.body;
			req.query = parseResult.data.query || req.query;
		}

		next();
	};

	handler.isValidationMiddleware = true;
	handler.description = optionsWithDefaults.description;
	handler.summary = optionsWithDefaults.summary;
	handler.tags = optionsWithDefaults.tags;
	handler.zodSchemas = {
		body: zodBodySchema,
		query: zodQuerySchema,
		response: zodResponseSchema,
		statusCodes: Object.fromEntries(
			Object.entries(optionsWithDefaults.statusCodes!).map(([statusCode, zodRawShape]) => [
				statusCode,
				turnToZodObject(zodRawShape),
			]),
		),
	};

	return handler;
};
