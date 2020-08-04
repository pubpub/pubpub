const compareArrayFingerprints = (from, to) => {
	return !from || from.length !== to.length || from.some((fromValue, i) => fromValue !== to[i]);
};

export const promiseCell = ({ getPromise, holdPreviousValue, invalidateOn, getErrorValue }) => {
	return (value, { node, cellState, updateValue }) => {
		const { fingerprint = null, promiseCount = 0 } = cellState;
		const newFingerprint = invalidateOn(node);
		const hasChanged = !compareArrayFingerprints(fingerprint, newFingerprint);
		if (hasChanged) {
			const newPromiseCount = promiseCount + 1;
			// eslint-disable-next-line no-param-reassign
			cellState.promiseCount = newPromiseCount;
			getPromise(node)
				.catch((err) => getErrorValue(err))
				.then((resolvedValue) => {
					if (cellState.promiseCount === newPromiseCount) {
						updateValue(resolvedValue);
					}
				});
			return holdPreviousValue ? value : null;
		}
		return value;
	};
};
