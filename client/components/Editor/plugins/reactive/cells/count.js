/* eslint-disable no-param-reassign */

const serializeFingerprint = (fingerprint) => {
	return JSON.stringify(fingerprint);
};

const maybeInitializeTransactionState = (attrTransactionState) => {
	if (!attrTransactionState.countsMap) {
		attrTransactionState.countsMap = {};
		attrTransactionState.highestCount = 0;
	}
	return attrTransactionState;
};

export const countCell = (nodeFingerprintFn) => {
	return (_, { node, attrTransactionState }) => {
		const { highestCount, countsMap } = maybeInitializeTransactionState(attrTransactionState);
		const hasFingerprint = !!nodeFingerprintFn;
		const fingerprint = nodeFingerprintFn && serializeFingerprint(nodeFingerprintFn(node));
		if (hasFingerprint && countsMap[fingerprint]) {
			return countsMap[fingerprint];
		}
		const nextCount = highestCount + 1;
		attrTransactionState.countsMap[fingerprint] = nextCount;
		attrTransactionState.highestCount = nextCount;
		return nextCount;
	};
};
