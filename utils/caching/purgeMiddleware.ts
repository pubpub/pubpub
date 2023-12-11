import { Request, Response, NextFunction } from 'express';
import { defer } from 'server/utils/deferred';
import { isDuqDuq } from 'utils/environment';
import { purgeSurrogateTag } from './purgeSurrogateTag';

/**
 * There are some routes that look like they change data, but they don't.
 */
const nonPurgeNonGetRoutes = {
	'/api/pubs/many': ['POST'],
	'/api/upload': ['POST'],
	'/api/pubs/text/convert': ['POST'],
} satisfies {
	[Path in `/api/${string}`]: ('POST' | 'PUT' | 'DELETE' | 'PATCH')[];
};

/**
 * Purge domain cache on CRUD operations
 *
 * WARNING: Do not return anything from this middleware!
 * It runs after the response has been sent, so returning anything will cause an error
 */
export const purgeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	/**
	 * Very strong fail safe, but don't purge cache on non-API requests
	 */
	if (!req.path.startsWith('/api')) {
		next();
	}

	/**
	 * Only purge in prod
	 */
	if (process.env.NODE_ENV !== 'production') {
		next();
	}

	/**
	 * We don't want to purge GET requests, that's the whole point!
	 */
	if (req.method === 'GET') {
		next();
	}

	/**
	 * We don't want to purge if the status code is an error
	 */
	if (res.statusCode >= 400) {
		next();
	}

	const shouldNotPurgeMethodsForPath = nonPurgeNonGetRoutes[req.path];

	if (shouldNotPurgeMethodsForPath && shouldNotPurgeMethodsForPath.includes(req.method)) {
		next();
	}

	/**
	 * On Fastly, we set the surrogate tag to the hostname
	 */
	const surrogateTag = req.hostname; // req.headers['surrogate-tag'];

	if (!surrogateTag) {
		next();
	}

	defer(async () => {
		await purgeSurrogateTag(surrogateTag as string, isDuqDuq());
	});
};
