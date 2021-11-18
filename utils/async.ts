import { assert } from 'utils/assert';

type AsyncIterable<T> = Iterable<T | Promise<T>> | Promise<Iterable<T | Promise<T>>>;
type AsyncForEachIteratee<T> = (value: T, index: number, arrayLength: number) => void;

/**
 * Native port of Bluebird's Promise.prototype.each. Accepts an iterable (or
 * Promise-wrapped iterable) of any value, and an callback function to be
 * executed for each value that the iterable yields.
 *
 * If a value is a promise, `asyncForEach` will wait for it before iterating
 * further.
 */
export async function asyncForEach<T>(
	iterable: AsyncIterable<T>,
	iteratee: AsyncForEachIteratee<T>,
): Promise<T[]> {
	const results: T[] = [];
	const resolvedList = Array.from(await iterable);
	const resolvedLength = resolvedList.length;
	let i = 0;
	for await (const value of resolvedList) {
		results.push(value);
		iteratee(value, i, resolvedLength);
		i++;
	}
	return results;
}

type AsyncMapIteratee<T, R> = (value: T, index: number, arrayLength: number) => R | Promise<R>;
type AsyncMapOptions = { concurrency?: number };

export async function asyncMap<T, R>(
	iterable: AsyncIterable<T>,
	iteratee: AsyncMapIteratee<T, R>,
	options?: AsyncMapOptions,
): Promise<R[]> {
	const concurrency = options?.concurrency ?? Infinity;
	const resolvedList = Array.from(await iterable);
	const resolvedLength = resolvedList.length;
	assert(concurrency > 0);
	return new Promise((resolve, reject) => {
		const results: R[] = [];

		let pending = 0;
		let cursor = 0;

		function enqueueNextPromises() {
			// If we have called .then() for all values, and no promises are pending,
			// resolve with the final array of results.
			if (cursor === resolvedLength && pending === 0) {
				resolve(results);
			} else {
				// Call .then() in batches for promises moving left->right, only
				// executing at maximum the value of the configured concurrency.
				while (pending < Math.min(concurrency, resolvedLength - cursor)) {
					const index = cursor;
					const next = resolvedList[index];
					pending++;
					Promise.resolve(next)
						.then(function onVisitedPromiseResolve(value) {
							return iteratee(value, index, resolvedLength);
						})
						.then(function onVisitedPromiseUnwrapped(value) {
							results[index] = value;
							pending--;
						})
						.catch(function onVisitedPromiseReject(err) {
							reject(err);
							pending--;
						});
					cursor++;
				}
			}
		}

		enqueueNextPromises();
	});
}

export async function asyncMapSeries<T, R>(
	iterable: AsyncIterable<T>,
	iteratee: AsyncMapIteratee<T, R>,
): Promise<R[]> {
	return asyncMap(iterable, iteratee, { concurrency: 1 });
}
