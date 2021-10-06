type FnOf<Arguments extends any[], ReturnType> = (...args: Arguments) => ReturnType;

type ExpiringPromiseOptions<ReturnType> = { timeout: number } & (
	| { fallback: ReturnType }
	| { throws: () => Error }
);

export const expiringPromise = <Arguments extends any[], ReturnType>(
	fn: FnOf<Arguments, Promise<ReturnType>>,
	options: ExpiringPromiseOptions<ReturnType>,
) => {
	const { timeout } = options;
	return (...args: Arguments): Promise<ReturnType> =>
		new Promise((resolve, reject) => {
			fn(...args)
				.then(resolve)
				.catch(reject);
			setTimeout(() => {
				if ('fallback' in options) {
					resolve(options.fallback);
				} else if ('throws' in options) {
					reject(options.throws());
				}
			}, timeout);
		});
};
