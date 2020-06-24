import React, { useContext, useEffect, useState, useMemo } from 'react';
import throttle from 'lodash.throttle';

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

export const useThrottled = (value, timeout, throttleOptions) => {
	const { leading, trailing } = throttleOptions;
	const [throttledValue, setThrottledValue] = useState(value);
	const throttledSetState = useMemo(
		() => throttle(setThrottledValue, timeout, throttleOptions),
		[timeout, leading, trailing]
	);

	useEffect(() => {
		throttledSetState(value);
	}, [value]);

	return throttledValue;
};
