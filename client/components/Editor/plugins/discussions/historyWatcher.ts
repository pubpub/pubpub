import { Node } from 'prosemirror-model';

type Callback = () => unknown;

type KeyCallback = {
	key: number;
	callback: Callback;
};

const getReadyCallbacks = (callbacks: KeyCallback[], historyKey: number) => {
	const ready: KeyCallback[] = [];
	const notReady: KeyCallback[] = [];

	callbacks.forEach((callback) => {
		if (historyKey >= callback.key) {
			ready.push(callback);
		} else {
			notReady.push(callback);
		}
	});

	return { ready: ready, notReady: notReady };
};

export const createHistoryWatcher = (initialDoc: Node, initialHistoryKey: number) => {
	let historyKey = initialHistoryKey;
	let doc = initialDoc;
	let callbacks: KeyCallback[] = [];

	const whenKeyReaches = (key: number, callback: Callback) => {
		if (historyKey >= key) {
			console.log('immediate');
			callback();
		} else {
			console.log('deferred');
			callbacks.push({ key: key, callback: callback });
		}
	};

	const getState = () => {
		return {
			currentHistoryKey: historyKey,
			currentDoc: doc,
		};
	};

	const updateState = (nextDoc: Node, nextHistoryKey: number) => {
		const previousHistoryKey = historyKey;
		const previousDoc = nextDoc;

		if (nextHistoryKey >= historyKey) {
			historyKey = nextHistoryKey;
			doc = nextDoc;
		}

		const hasHistoryKeyAdvanced = historyKey > previousHistoryKey;

		if (hasHistoryKeyAdvanced) {
			const { ready, notReady } = getReadyCallbacks(callbacks, historyKey);
			callbacks = notReady;
			ready.forEach((kc) => kc.callback());
		}

		return {
			...getState(),
			hasHistoryKeyAdvanced: hasHistoryKeyAdvanced,
			previousHistoryKey: previousHistoryKey,
			previousDoc: previousDoc,
		};
	};

	return { whenKeyReaches: whenKeyReaches, updateState: updateState, getState: getState };
};
