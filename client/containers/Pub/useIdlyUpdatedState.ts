import { useCallback, useMemo, useRef, useState } from 'react';

import { Callback, PatchFn, PatchFnArg } from 'types';

type InitialValue<T> = T | (() => T);

declare global {
	interface Window {
		requestIdleCallback(cb: Callback): number;
	}
}

export type IdlePatchFn<T> = PatchFn<T> & {
	immediately: (isImmediate: boolean) => PatchFn<T>;
};

export const useIdlyUpdatedState = <T>(initialValue: InitialValue<T>, timeout = 50) => {
	const [state, setUnderlyingState] = useState(initialValue);
	const queuedUpdates = useRef<PatchFnArg<T>[]>([]);
	const idleCallback = useRef<null | number>(null);

	const commitStateChanges = useCallback(
		() =>
			setUnderlyingState((prevState) => {
				idleCallback.current = null;
				let nextState = prevState;
				const itemsInQueue = queuedUpdates.current.length;
				for (let i = 0; i < itemsInQueue; i++) {
					const update = queuedUpdates.current[i];
					const patch = typeof update === 'function' ? update(nextState) : update;
					nextState = { ...nextState, ...patch };
				}
				queuedUpdates.current = [];
				return nextState;
			}),
		[],
	);

	const updateState: IdlePatchFn<T> = useMemo(
		() => {
			const stateUpdater = (update: PatchFnArg<T>) => {
				queuedUpdates.current.push(update);
				if ('requestIdleCallback' in window) {
					if (!idleCallback.current) {
						idleCallback.current = requestIdleCallback(commitStateChanges, { timeout });
					}
				} else {
					commitStateChanges();
				}
			};

			const immediately = (isImmediate = true) => {
				return (update: PatchFnArg<T>) => {
					if (isImmediate) {
						queuedUpdates.current.push(update);
						commitStateChanges();
					} else {
						updateState(update);
					}
				};
			};

			return Object.assign(stateUpdater, { immediately });
		},
		// React Hook useMemo has a missing dependency: 'T'
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[timeout, commitStateChanges],
	);

	return [state, updateState] as const;
};
