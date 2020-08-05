import { reactivePluginKey } from './key';

const assertCanCreateReactiveNodeStore = (nodeType, spec, idAttrKey) => {
	const specHasReactiveAttrs = Object.values(spec.attrs).some((attrSpec) => attrSpec.reactive);
	const specHasCorrectIdAttr = spec.attrs[idAttrKey] && !spec.attrs[idAttrKey].reactive;
	if (!specHasReactiveAttrs) {
		throw new Error(
			`Reactive node definition for ${nodeType} should have a reactive attr (i.e. an attr definition with a 'reactive' key)`,
		);
	}
	if (!specHasCorrectIdAttr) {
		throw new Error(
			`Reactive node definition for ${nodeType} must have an ID attr called ${idAttrKey} that is non-reactive.`,
		);
	}
};

const getAttrTransactionState = (transactionState, key) => {
	if (!transactionState[key]) {
		// eslint-disable-next-line no-param-reassign
		transactionState[key] = {};
	}
	return transactionState[key];
};

class CellStore {
	constructor(cellFn) {
		this.cellFn = cellFn;
		this.state = {};
		this.value = null;
	}

	update(node, view, transactionState, attrTransactionState, updateValue) {
		const nextValue = this.cellFn(this.value, {
			node: node,
			view: view,
			transactionState: transactionState,
			attrTransactionState: attrTransactionState,
			updateValue: updateValue,
			cellState: this.state,
		});
		const isUpdated = nextValue !== this.value;
		this.value = nextValue;
		return [nextValue, isUpdated];
	}
}

class NodeStore {
	constructor(nodeType, reactiveAttrsDefinition) {
		this.reactiveAttrs = {};
		this._initializeEntries(nodeType, reactiveAttrsDefinition);
	}

	_initializeEntries(nodeType, reactiveAttrsDefinition) {
		const entries = Object.entries(reactiveAttrsDefinition);
		this.cells = [];
		this.attrTransactionStateKeys = [];
		this.attrs = [];
		for (let i = 0; i < entries.length; i++) {
			const [attr, cellFn] = entries[i];
			this.attrs.push(attr);
			this.cells.push(new CellStore(cellFn));
			this.attrTransactionStateKeys.push(`${nodeType}-${attr}`);
		}
	}

	_onUpdateNode(view, node, attr, value) {
		this.reactiveAttrs[attr] = value;
		const transaction = view.state.tr;
		transaction.setMeta(reactivePluginKey, { invalidateNodeId: node.id });
		view.dispatch(transaction);
	}

	update(node, view, transactionState) {
		let hasUpdate = false;
		for (let i = 0; i < this.cells.length; i++) {
			const cell = this.cells[i];
			const attr = this.attrs[i];
			const stateKey = this.attrTransactionStateKeys[i];
			const attrTransactionState = getAttrTransactionState(transactionState, stateKey);
			// eslint-disable-next-line no-loop-func
			const [nextValue, isUpdated] = cell.update(
				node,
				view,
				transactionState,
				attrTransactionState,
				(value) => this._onUpdateNode(view, node, attr, value),
			);
			hasUpdate = hasUpdate || isUpdated;
			this.reactiveAttrs[attr] = nextValue;
		}
		return hasUpdate;
	}
}
export class ReactiveStateStore {
	constructor(nodeSpecs, idAttrKey = 'id') {
		this.nodes = {};
		this._createReactiveAttrDefinitions(nodeSpecs, idAttrKey);
	}

	_createReactiveAttrDefinitions(nodeSpecs, idAttrKey) {
		this.reactiveAttrDefinitions = {};
		Object.values(nodeSpecs).forEach((nodeType) => {
			const { name, spec } = nodeType;
			if (spec.reactive) {
				assertCanCreateReactiveNodeStore(name, spec, idAttrKey);
				const template = {};
				Object.entries(spec.attrs).forEach(([attr, definition]) => {
					const { reactive } = definition;
					if (reactive) {
						template[attr] = reactive;
					}
				});
				this.reactiveAttrDefinitions[name] = template;
			}
		});
	}

	getStoreForNode(node) {
		const {
			attrs: { id },
			type: { name },
		} = node;
		if (id) {
			const store = this.nodes[id];
			const definition = this.reactiveAttrDefinitions[name];
			if (store) {
				return store;
			}
			if (definition) {
				this.nodes[id] = new NodeStore(name, definition);
				return this.nodes[id];
			}
		}
		return null;
	}

	startTransaction(view) {
		const transactionState = {};
		return {
			updateNode: (node) => {
				const nodeStore = this.getStoreForNode(node);
				if (nodeStore) {
					const invalidated = nodeStore.update(node, view, transactionState);
					return invalidated;
				}
				return false;
			},
		};
	}
}
