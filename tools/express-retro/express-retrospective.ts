import type { Application, RequestHandler } from 'express';
import path from 'path';

import app from 'server/server';

/**
 * this util is generic,
 * not coupled to the use of the library itself
 */

type RouterHandle = Function & {
	stack: Stack;
};

interface HandlerLayer {
	handle: RequestHandler;
}

type Handle = Function | RouterHandle;

interface LayerBase {
	handle: Handle;
	name: string;
}

interface Route {
	path: string;
	methods: {
		get?: boolean;
		post?: boolean;
		put?: boolean;
		delete?: boolean;
	};
	stack: HandlerLayer[];
}

interface RouterLayer extends LayerBase {
	handle: RouterHandle;
	name: 'router';
	regexp: RegExp;
}

interface RequestParam {
	name: string;
	optional: boolean;
}

interface BoundDispatchLayer extends LayerBase {
	handle: Function;
	name: 'bound dispatch';
	route: Route;
	keys: RequestParam[];
}

type Layer = RouterLayer | BoundDispatchLayer;

type Stack = Layer[];

function joinPaths(path1: string, path2: string) {
	if (path1[path1.length - 1] === '/' || path2[0] === '/') {
		return `${path1}${path2}`;
	}
	return `${path1}/${path2}`;
}

// https://github.com/expressjs/express/issues/3308#issuecomment-300957572
function regexPathToString(regexPath: RegExp) {
	const match = regexPath
		.toString()
		.replace('\\/?', '')
		.replace('(?=\\/|$)', '$')
		.match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
	return match
		? match[1]
				.replace(/\\(.)/g, '$1')
				.split('/')
				.filter((s) => s.length > 0)
				.join()
		: `<complex:${regexPath.toString()}>`;
}

function handleBoundDispatchLayer(layer: BoundDispatchLayer, path: string) {
	const methods: string[] = Object.keys(layer.route.methods).filter(
		(method) => (layer.route.methods as any)[method],
	) as (keyof Route['methods'])[];
	return methods.map((method) => ({
		method,
		path: joinPaths(path, layer.route.path),
		handlers: layer.route.stack.map((handleLayer) => handleLayer.handle),
		params: layer.keys.map(({ name, optional }) => ({ name, optional })),
	}));
}

function handleRouterLayer(layer: RouterLayer, path: string) {
	const routerPath = regexPathToString(layer.regexp);
	return parseStackRecursively(joinPaths(path, routerPath), layer.handle.stack);
}

function parseStackRecursively(path: string, stack: Stack): ExpressRetroSpectiveObject[] {
	return stack.flatMap((layer) => {
		if (layer.name === 'bound dispatch') {
			return handleBoundDispatchLayer(layer, path);
		}
		if (layer.name === 'router') {
			return handleRouterLayer(layer, path);
		}
		return [];
	});
}

interface ExpressRetroSpectiveObject {
	path: string;
	method: string;
	params: RequestParam[];
	handlers: RequestHandler<any, any, any, any>[];
}

export function expressRetroSpective(app: Application): ExpressRetroSpectiveObject[] {
	// eslint-disable-next-line no-underscore-dangle
	const mainStack: Stack = app._router.stack;
	const expressRetroSpectiveResult = parseStackRecursively('', mainStack);
	return expressRetroSpectiveResult;
}

async function main() {
	if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
		require(path.join(process.cwd(), '../../config.js'));
		const { setupLocalDatabase } = require('../../localDatabase.js');
		await setupLocalDatabase();
	}

	const loadServer = async () => {
		return (await import('../../dist/server/server/server')).startServer();
	};
	const server = await loadServer();
	console.log(expressRetroSpective(server));
}

main();
