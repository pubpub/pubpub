/* eslint-disable @typescript-eslint/no-shadow */
import { Prettify, UnionToIntersection } from 'utils/types';
import {
	InferShapeOrZodTypeIfNotUndefined,
	InferShapeOrZodTypeIfNotUndefinedStrict,
	InferStatusCodes,
	StatusCodes,
	ZodRawShapeOrObjOrArray,
} from './validation-middleware';
import { contract } from './contract';

export type IndexOrUndefined<
	T,
	K extends string,
	KK extends string | undefined = undefined,
> = K extends keyof T
	? KK extends undefined
		? T[K]
		: KK extends keyof T[K]
		? T[K][KK]
		: undefined
	: undefined;

export type Contract = typeof contract;

type Routes = keyof Contract;

type ContractRoutes = Contract[Routes];
type AllowedMethods = keyof UnionToIntersection<ContractRoutes>;

type AllRoutesWithMethod<Method extends AllowedMethods> = {
	[Route in Routes]: Method extends keyof Contract[Route] ? Route : never;
}[Routes];

type MakeOptionalKeys<T> = Prettify<
	UnionToIntersection<
		{
			[K in keyof T]: undefined extends T[K]
				? { [KK in K]?: T[K] | undefined }
				: T[K] extends never
				? never
				: { [KK in K]: T[K] };
		}[keyof T]
	>
>;

const createSubFetch = <Method extends AllowedMethods>(method: Method) => {
	return async <
		Route extends AllRoutesWithMethod<Method>,
		ReqBody extends IndexOrUndefined<Contract[Route], Method, 'body'>,
		ResBody extends IndexOrUndefined<Contract[Route], Method, 'response'>,
		ReqQuery extends IndexOrUndefined<Contract[Route], Method, 'query'>,
		ResStatusCodes extends IndexOrUndefined<Contract[Route], Method, 'statusCodes'>,
	>(
		route: Route,
		// eslint-disable-next-line no-undef
		fetchConfig: Omit<RequestInit, 'body' | 'method' | 'type' | 'credentials'> &
			MakeOptionalKeys<{
				body: InferShapeOrZodTypeIfNotUndefinedStrict<ReqBody>;
				query: InferShapeOrZodTypeIfNotUndefinedStrict<ReqQuery>;
			}>,
	) => {
		const { ...rest } = fetchConfig;
		// eslint-disable-next-line no-undef
		const request: RequestInit = {
			...rest,
			method,
			headers: {
				...rest.headers,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},

			credentials: 'include',
		};

		if ('body' in fetchConfig) {
			request.body = JSON.stringify(fetchConfig.body);
		}

		const routeWithQuery =
			'query' in fetchConfig
				? `${route}?${new URLSearchParams(
						fetchConfig.query as Record<string, string>,
				  ).toString()}`
				: route;

		const response = await fetch(routeWithQuery, request);

		if (!response.ok) {
			const err = await response.json();
			throw err;
		}
		return response.json() as
			| InferStatusCodes<ResStatusCodes>
			| (ResStatusCodes extends StatusCodes
					? ResBody extends ZodRawShapeOrObjOrArray
						? InferShapeOrZodTypeIfNotUndefined<ResBody>
						: never
					: InferShapeOrZodTypeIfNotUndefined<ResBody>);
	};
};

export const client = {
	post: createSubFetch('POST'),
	get: createSubFetch('GET'),
	// put: createSubFetch('PUT'),
	// delete: createSubFetch('DELETE'),
};
