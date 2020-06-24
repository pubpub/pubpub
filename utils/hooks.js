import React, { useContext, useCallback, useEffect } from 'react';
import throttle from "lodash.throttle";

export const PageContext = React.createContext({});

export const PendingChanges = React.createContext({
	pendingPromise: (x) => x,
});

export const usePageContext = (previewContextObject) => {
	const contextObject = useContext(PageContext);
	return previewContextObject || contextObject;
};

export const usePendingChanges = () => {
	return useContext(PendingChanges);
};

export const useCallbackThrottled = (fn, timeout, throttleOptions, deps = []) => 
	useCallback(throttle(fn, timeout, throttleOptions), deps);

export const useEffectThrottled = (fn, timeout, throttleOptions, args = []) => {
	const execute = useCallbackThrottled(fn, 1000, throttleOptions);
	useEffect(() => execute(...args), [execute, ...args]);
};