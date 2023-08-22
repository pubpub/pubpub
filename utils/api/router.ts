/* eslint-disable @typescript-eslint/no-shadow */
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { Prettify, UnionToIntersection } from 'utils/types';
import {
	InferShapeOrZodTypeIfNotUndefined,
	InferShapeOrZodTypeIfNotUndefinedStrict,
	InferStatusCodes,
	StatusCodes,
	ZodRawShapeOrObjOrArray,
	validate,
} from './validation-middleware';
import { pubSchema } from 'types/schemas/pub';
import { CanCreatePub } from 'types';

extendZodWithOpenApi(z);

type ValidationInput = Parameters<typeof validate>[0];
export type CustomRouter = {
	[key in `/api/${string}`]: {
		GET?: ValidationInput;
		POST?: ValidationInput;
		PUT?: ValidationInput;
		DELETE?: ValidationInput;
	};
};

export const router = {
	'/api/pubs': {
		POST: {
			description: 'Create a Pub',
			security: true,
			tags: ['Pub'],
			body: z
				.object({
					communityId: z.string(),
				})
				.and(
					z.union([
						z.object({
							collectionId: z.string().optional(),
							createPubToken: z.undefined(),
						}),
						z.object({
							createPubToken: z.string().optional(),
							collectionId: z.undefined(),
						}),
						z.object({
							createPubToken: z.undefined(),
							collectionId: z.undefined(),
						}),
					]),
				) satisfies z.ZodType<CanCreatePub>,
			statusCodes: {
				201: pubSchema,
			},
		},
	},
	'/api/collectionPubs': {
		GET: {
			tags: ['CollectionPubs'],
			description: 'Get the pubs associated with a collection',
			security: false,
			query: {
				pubId: z.string().uuid().optional(),
				collectionId: z.string().uuid(),
				communityId: z.string().uuid(),
			},
			response: z.array(pubSchema),
		},
	},
} satisfies CustomRouter;

// const getOptions = <
// 	R extends CustomRouter,
// 	Routes extends `/api/${string}`,
// 	S extends 'POST' | 'GET' | 'PUT' | 'DELETE',
// 	M extends NonNullable<R[Routes][S]>,
// 	B extends M[''],
// >(
// 	router: R,
// 	route: Routes,
// 	method: S,
// 	something: M['body'],
// ) => router[route][method];

// const options = getOptions(router, '/api/pubs', 'POST');

// type Routes = `/api/${string}`;
// type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
// type Options = CustomRouter[Routes][Methods];
// let x: Options;

// export const createRouter = <const Router extends CustomRouter>(router: Router) => ({
// 	router,

// const validatehelper = <V extends ValidationInput>(input: Required<V>) => validate(input);

// type ValidationOutput<V extends ValidationInput> = ReturnType<typeof validatehelper<V>>;
export type IndexOrUndefined<T, K extends string> = K extends keyof T ? T[K] : undefined;

export type Contract = typeof router;
// });

// const createdRouter = createRouter(router);

// createdRouter.createRoute(
// createRoute('/api/pubs', 'POST', async (req, res) => {
// 	return res.status(201).json({
// 		id: '123',
// 		title: 'test',
// 	});
// });

type Routes = keyof Contract; // Extract<keyof Contract, `/api/${string}`>;

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

// type X<Objects extends Record<string, any>> = MakeOptionalKeys<Objects>;

// // Test it out
// type Y = X<{ body: boolean; query: string | undefined }>;

const createSubFetch = <Method extends AllowedMethods>(method: Method) => {
	return async <
		Route extends AllRoutesWithMethod<Method>, // Extract<keyof Contract, `/api/${string}`>,
		ReqBody extends Method extends keyof Contract[Route]
			? IndexOrUndefined<Contract[Route][Method], 'body'>
			: never,
		// @ts-expect-error
		ResBody extends IndexOrUndefined<Contract[Route][Method], 'response'>,
		// @ts-expect-error
		ReqQuery extends IndexOrUndefined<Contract[Route][Method], 'query'>,
		// @ts-expect-error
		ResStatusCodes extends IndexOrUndefined<Contract[Route][Method], 'statusCodes'>,
	>(
		route: Route,
		fetchConfig: Omit<RequestInit, 'body' | 'method' | 'type' | 'credentials'> &
			MakeOptionalKeys<{
				body: InferShapeOrZodTypeIfNotUndefinedStrict<ReqBody>;
				query: InferShapeOrZodTypeIfNotUndefinedStrict<ReqQuery>;
			}>,
	) => {
		const { ...rest } = fetchConfig;
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

// client.post('/api/pubs', {
// 	body: {
// 		communityId: '123',
// 	},
// });

// const res = await client.get('/api/collectionPubs', {
// 	query: {
// 		communityId: '123',
// 		collectionId: '123',
// 	},
// });
